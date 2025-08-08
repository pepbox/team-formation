import { Types } from "mongoose";
import { VotingTimer } from "../models/votingTimer";
import PlayerService from "../../players/services/playerService";
import TeamService from "../../players/services/teamService";
import { SessionStates } from "../../session/types/sessionStates";
import { SessionEmitters } from "../../../services/socket/sessionEmitters";
import { ServerToAllEvents } from "../../../services/socket/enums/SharedEvents";

class VotingService {
  private playerService = new PlayerService();
  private teamService = new TeamService();

  async createVotingTimers(
    sessionId: string,
    startTime: Date,
    votingDuration: number
  ) {
    try {
      const teams = await this.teamService.getTeamsBySessionId(sessionId);
      const votingEndTime = new Date(startTime.getTime() + votingDuration * 1000);
      
      const timers = teams.map((team) => ({
        sessionId: new Types.ObjectId(sessionId),
        teamId: team._id,
        votingEndTime,
      }));

      console.log("Voting timers created with value ::----> ", timers);

      await VotingTimer.insertMany(timers);
      console.log(
        `Created ${timers.length} voting timers for session ${sessionId}`
      );
    } catch (error) {
      console.error("Error creating voting timers:", error);
      throw error;
    }
  }

  async processTeamLeaderSelection(teamId: string, sessionId: string) {
    try {
      const teamPlayers = await this.playerService.getPlayersByTeamId(teamId);

      if (!teamPlayers || teamPlayers.length === 0) {
        console.log(
          `No players found for team ${teamId}, skipping leader selection`
        );
        return;
      }

      // Calculate votes for each player
      const teamPlayersWithVotes = teamPlayers.map((teamPlayer) => {
        const votes = teamPlayers.filter(
          (p) => p.votedLeader?.toString() === teamPlayer._id.toString()
        ).length;

        // Convert mongoose document to plain object if needed
        const playerObj = (teamPlayer as any).toObject
          ? (teamPlayer as any).toObject()
          : teamPlayer;

        return {
          ...playerObj,
          votes,
        };
      });

      // Find winners (players with max votes)
      const maxVotes = Math.max(...teamPlayersWithVotes.map((p) => p.votes));
      const winners = teamPlayersWithVotes.filter((p) => p.votes === maxVotes);

      if (winners.length === 0) {
        console.log(
          `No winners found for team ${teamId}, skipping leader selection`
        );
        return;
      }

      // Select random leader from winners
      const randomIndex = Math.floor(Math.random() * winners.length);
      const chosenLeader = winners[randomIndex];

      if (!chosenLeader) {
        console.log(
          `No leader could be chosen for team ${teamId}, skipping leader selection`
        );
        return;
      }

      // Prepare winners data for storage
      const winnersData = winners.map((w) => ({
        _id: w._id,
        name: w.firstName + " " + w.lastName,
        votes: w.votes,
      }));

      // Update team with leader and winners
      await this.teamService.updateTeam(teamId, {
        leaderId: chosenLeader._id,
        winners: winnersData,
      });

      console.log(
        `Leader selected for team ${teamId}: ${chosenLeader.firstName} ${chosenLeader.lastName}`
      );

      // Emit socket events for this team
      SessionEmitters.toTeam(
        sessionId,
        teamId,
        ServerToAllEvents.TEAM_LEADER_SELECTED,
        {
          teamId,
          leaderId: chosenLeader._id,
          leaderName: `${chosenLeader.firstName} ${chosenLeader.lastName}`,
          winners: winnersData,
        }
      );

      // Check if all teams have leaders assigned
      await this.checkAndUpdateSessionState(sessionId);
    } catch (error) {
      console.error(
        `Error processing leader selection for team ${teamId}:`,
        error
      );
      throw error;
    }
  }

  private async checkAndUpdateSessionState(sessionId: string) {
    try {
      const teams = await this.teamService.getTeamsBySessionId(sessionId);
      const allTeamsHaveLeaders = teams.every((team) => team.leaderId);

      if (allTeamsHaveLeaders) {
        // Use dynamic import to avoid circular dependency
        const { default: SessionService } = await import(
          "../../session/services/sessionService"
        );
        const sessionService = new SessionService();

        const session = await sessionService.fetchSessionById(sessionId);

        if (session && session.state !== SessionStates.FINAL) {
          await sessionService.updateSessionById(sessionId, {
            state: SessionStates.FINAL,
          });

          SessionEmitters.toSession(
            sessionId,
            ServerToAllEvents.SESSION_UPDATE,
            {
              state: SessionStates.FINAL,
            }
          );

          console.log(`Session ${sessionId} updated to FINAL state`);
        }
      }
    } catch (error) {
      console.error("Error checking session state:", error);
    }
  }
}

export default VotingService;
