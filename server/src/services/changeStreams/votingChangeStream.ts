import { ChangeStream, ChangeStreamDeleteDocument } from "mongodb";
import { VotingTimer } from "../../modules/voting/models/votingTimer";
import VotingService from "../../modules/voting/services/votingService";

class VotingChangeStream {
  private changeStream: ChangeStream | null = null;
  private votingService = new VotingService();

  async initialize() {
    try {
      console.log("Initializing Voting Change Stream...");
      
      this.changeStream = VotingTimer.watch([
        { $match: { operationType: "delete" } }
      ]);

      this.changeStream.on("change", this.handleChange.bind(this));
      
      this.changeStream.on("error", (error) => {
        console.error("Voting Change Stream error:", error);
        this.reconnect();
      });

      this.changeStream.on("close", () => {
        console.log("Voting Change Stream closed");
        this.reconnect();
      });

      console.log("Voting Change Stream initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Voting Change Stream:", error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  private async handleChange(change: ChangeStreamDeleteDocument) {
    try {
      console.log("Voting timer expired, processing leader selection...");
      
      // When a voting timer expires, process all pending leader selections for active sessions
      await this.processAllPendingLeaderSelections();
      
    } catch (error) {
      console.error("Error handling voting change stream event:", error);
    }
  }

  private async processAllPendingLeaderSelections() {
    try {
      // Import Session model directly
      const { Session } = await import("../../modules/session/models/session");
      
      // Find all sessions in LEADER_VOTING state where voting has ended
      const votingSessions = await Session.find({
        state: "LEADER_VOTING",
        votingStartTime: { $exists: true },
        votingDuration: { $exists: true }
      });

      console.log(`Found ${votingSessions.length} voting sessions to check`);

      for (const session of votingSessions) {
        if (!session.votingStartTime || !session.votingDuration) {
          continue;
        }
        
        const votingEndTime = new Date(
          session.votingStartTime.getTime() + session.votingDuration * 1000
        );
        
        if (new Date() >= votingEndTime) {
          console.log(`Processing session ${session._id} - voting ended at ${votingEndTime}`);
          
          // Import TeamService
          const { default: TeamService } = await import("../../modules/players/services/teamService");
          const teamService = new TeamService();
          
          const teams = await teamService.getTeamsBySessionId(session._id.toString());
          console.log(`Found ${teams.length} teams in session ${session._id}`);
          
          for (const team of teams) {
            // Only process teams that don't have a leader assigned yet
            if (!team.leaderId) {
              console.log(`Processing leader selection for team ${team._id}`);
              await this.votingService.processTeamLeaderSelection(
                team._id.toString(),
                session._id.toString()
              );
            } else {
              console.log(`Team ${team._id} already has a leader, skipping`);
            }
          }
        } else {
          console.log(`Session ${session._id} voting still active until ${votingEndTime}`);
        }
      }
    } catch (error) {
      console.error("Error processing pending leader selections:", error);
    }
  }

  private async reconnect() {
    if (this.changeStream) {
      try {
        await this.changeStream.close();
      } catch (error) {
        console.error("Error closing change stream:", error);
      }
    }
    
    setTimeout(() => {
      console.log("Reconnecting Voting Change Stream...");
      this.initialize();
    }, 5000);
  }

  async close() {
    if (this.changeStream) {
      await this.changeStream.close();
      this.changeStream = null;
    }
  }
}

export default VotingChangeStream;