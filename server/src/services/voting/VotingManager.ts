import { SessionEmitters } from "../socket/sessionEmitters";
import { ServerToAllEvents } from "../socket/enums/SharedEvents";
import { SessionStates } from "../../modules/session/types/sessionStates";

interface VotingSession {
  sessionId: string;
  votingEndTime: Date;
  timer: NodeJS.Timeout;
  countdownInterval: NodeJS.Timeout;
}

class VotingManager {
  private static instance: VotingManager;
  private activeVotingSessions = new Map<string, VotingSession>();

  private constructor() {}

  static getInstance(): VotingManager {
    if (!VotingManager.instance) {
      VotingManager.instance = new VotingManager();
    }
    return VotingManager.instance;
  }

  /**
   * Start voting for a session with immediate timer execution
   */
  async startVoting(sessionId: string, votingDurationSeconds: number): Promise<void> {
    try {
      // Clear any existing voting for this session
      this.stopVoting(sessionId);

      const votingEndTime = new Date(Date.now() + votingDurationSeconds * 1000);
      
      console.log(`Starting voting for session ${sessionId}, ends at ${votingEndTime.toISOString()}`);

      // Create the main timer that will execute leader selection
      const timer = setTimeout(async () => {
        await this.processVotingEnd(sessionId);
      }, votingDurationSeconds * 1000);

      // Create countdown interval for real-time updates (every 500ms)
      const countdownInterval = setInterval(() => {
        this.sendCountdownUpdate(sessionId, votingEndTime);
      }, 500);

      // Store the voting session
      this.activeVotingSessions.set(sessionId, {
        sessionId,
        votingEndTime,
        timer,
        countdownInterval,
      });

      // Send initial countdown
      this.sendCountdownUpdate(sessionId, votingEndTime);

    } catch (error) {
      console.error(`Error starting voting for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Stop voting for a session (cleanup timers)
   */
  stopVoting(sessionId: string): void {
    const votingSession = this.activeVotingSessions.get(sessionId);
    if (votingSession) {
      clearTimeout(votingSession.timer);
      clearInterval(votingSession.countdownInterval);
      this.activeVotingSessions.delete(sessionId);
      console.log(`Stopped voting for session ${sessionId}`);
    }
  }

  /**
   * Process voting end - execute leader selection for all teams
   */
  private async processVotingEnd(sessionId: string): Promise<void> {
    try {
      console.log(`Processing voting end for session ${sessionId}`);

      // Stop countdown updates
      const votingSession = this.activeVotingSessions.get(sessionId);
      if (votingSession) {
        clearInterval(votingSession.countdownInterval);
      }

      // Notify users that processing has started
      SessionEmitters.toSession(sessionId, ServerToAllEvents.VOTING_PROCESSING_STARTED, {
        message: "Processing votes... Please wait.",
      });

      // Import services dynamically to avoid circular dependencies
      const { default: TeamService } = await import("../../modules/players/services/teamService");
      const { default: VotingService } = await import("../../modules/voting/services/votingService");
      
      const teamService = new TeamService();
      const votingService = new VotingService();

      // Get all teams in the session
      const teams = await teamService.getTeamsBySessionId(sessionId);
      console.log(`Found ${teams.length} teams to process for session ${sessionId}`);

      let processedTeams = 0;
      let failedTeams = 0;

      // Process each team
      for (const team of teams) {
        try {
          if (!team.leaderId) {
            console.log(`Processing leader selection for team ${team._id}`);
            await votingService.processTeamLeaderSelection(
              team._id.toString(),
              sessionId
            );
            processedTeams++;
          } else {
            console.log(`Team ${team._id} already has a leader, skipping`);
            processedTeams++;
          }
        } catch (error) {
          console.error(`Error processing team ${team._id}:`, error);
          failedTeams++;
        }
      }

      // Clean up the voting session
      this.activeVotingSessions.delete(sessionId);

      // Notify completion
      SessionEmitters.toSession(sessionId, ServerToAllEvents.VOTING_PROCESSING_COMPLETED, {
        processedTeams,
        failedTeams,
        totalTeams: teams.length,
      });

      console.log(`Voting processing completed for session ${sessionId}: ${processedTeams} processed, ${failedTeams} failed`);

    } catch (error) {
      console.error(`Error processing voting end for session ${sessionId}:`, error);
      
      // Clean up and notify error
      this.activeVotingSessions.delete(sessionId);
      SessionEmitters.toSession(sessionId, ServerToAllEvents.VOTING_PROCESSING_ERROR, {
        error: "Failed to process votes. Please try again.",
      });
    }
  }

  /**
   * Send countdown update to users
   */
  private sendCountdownUpdate(sessionId: string, votingEndTime: Date): void {
    const now = new Date();
    const timeRemaining = Math.max(0, votingEndTime.getTime() - now.getTime());
    const secondsRemaining = Math.ceil(timeRemaining / 1000);

    if (secondsRemaining > 0) {
      SessionEmitters.toSession(sessionId, ServerToAllEvents.VOTING_COUNTDOWN_UPDATE, {
        secondsRemaining,
        timeRemaining,
      });
    }
  }

  /**
   * Get remaining time for a session
   */
  getRemainingTime(sessionId: string): number | null {
    const votingSession = this.activeVotingSessions.get(sessionId);
    if (!votingSession) return null;

    const now = new Date();
    const timeRemaining = Math.max(0, votingSession.votingEndTime.getTime() - now.getTime());
    return Math.ceil(timeRemaining / 1000);
  }

  /**
   * Check if session is currently voting
   */
  isVotingActive(sessionId: string): boolean {
    return this.activeVotingSessions.has(sessionId);
  }

  /**
   * Restore voting sessions after server restart
   */
  async restoreVotingSessions(): Promise<void> {
    try {
      console.log("Restoring voting sessions after server restart...");

      // Import Session model
      const { Session } = await import("../../modules/session/models/session");

      // Find all sessions in LEADER_VOTING state
      const votingSessions = await Session.find({
        state: SessionStates.LEADER_VOTING,
        votingStartTime: { $exists: true },
        votingDuration: { $exists: true }
      });

      console.log(`Found ${votingSessions.length} voting sessions to restore`);

      for (const session of votingSessions) {
        if (!session.votingStartTime || !session.votingDuration) continue;

        const votingEndTime = new Date(
          session.votingStartTime.getTime() + session.votingDuration * 1000
        );
        const now = new Date();
        const remainingSeconds = Math.max(0, Math.ceil((votingEndTime.getTime() - now.getTime()) / 1000));

        if (remainingSeconds > 0) {
          console.log(`Restoring voting for session ${session._id}, ${remainingSeconds}s remaining`);
          await this.startVoting(session._id.toString(), remainingSeconds);
        } else {
          console.log(`Voting expired for session ${session._id}, processing immediately`);
          await this.processVotingEnd(session._id.toString());
        }
      }

      console.log("Voting session restoration completed");
    } catch (error) {
      console.error("Error restoring voting sessions:", error);
    }
  }

  /**
   * Get all active voting sessions (for debugging)
   */
  getActiveVotingSessions(): string[] {
    return Array.from(this.activeVotingSessions.keys());
  }
}

export default VotingManager;
