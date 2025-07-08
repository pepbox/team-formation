import PlayerService from "../../modules/players/services/playerService";
import SessionService from "../../modules/session/services/sessionService";
import { SessionStates } from "../../modules/session/types/sessionStates";
import { AccessTokenPayload } from "../../utils/jwtUtils";
import { socketManager } from "./socketManager";

// interface UserPayload {
//   id: string;
//   role: "USER" | "ADMIN" | string;
//   sessionId: string;
// }

interface SessionRoom {
  sessionId: string;
  admins: Set<string>; // socketIds of admins
  players: Set<string>; // socketIds of players
  teams: Map<string, Set<string>>; // teamId -> Set of socketIds
  allSockets: Set<string>; // all sockets in this session
}

class RoomManager {
  private sessions = new Map<string, SessionRoom>();
  private socketToSession = new Map<string, string>();
  private socketToTeam = new Map<string, string>();

  // Add socket to session room
  addSocketToSession(socketId: string, user: AccessTokenPayload): void {
    const { sessionId, role } = user;

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        admins: new Set(),
        players: new Set(),
        teams: new Map(),
        allSockets: new Set(),
      });
    }

    const sessionRoom = this.sessions.get(sessionId)!;

    // Add to appropriate role set
    if (role === "ADMIN") {
      sessionRoom.admins.add(socketId);
    } else if (role === "USER") {
      sessionRoom.players.add(socketId);
    }

    sessionRoom.allSockets.add(socketId);

    this.socketToSession.set(socketId, sessionId);

    console.log(
      `${role} ${user.id} joined session ${sessionId} - Socket: ${socketId}`
    );
  }

  // Remove socket from session
  removeSocketFromSession(socketId: string): void {
    const sessionId = this.socketToSession.get(socketId);
    if (!sessionId) return;

    const sessionRoom = this.sessions.get(sessionId);
    if (!sessionRoom) return;

    // Remove from all sets
    sessionRoom.admins.delete(socketId);
    sessionRoom.players.delete(socketId);
    sessionRoom.allSockets.delete(socketId);

    // Remove from team if assigned
    const teamId = this.socketToTeam.get(socketId);
    if (teamId) {
      sessionRoom.teams.get(teamId)?.delete(socketId);
      this.socketToTeam.delete(socketId);

      // Clean up empty team
      if (sessionRoom.teams.get(teamId)?.size === 0) {
        sessionRoom.teams.delete(teamId);
      }
    }

    // Clean up mappings
    this.socketToSession.delete(socketId);

    // Clean up empty session
    if (sessionRoom.allSockets.size === 0) {
      this.sessions.delete(sessionId);
    }

    console.log(`Socket ${socketId} removed from session ${sessionId}`);
  }

  // Assign players to teams (called after randomization)
  assignPlayersToTeams(
    sessionId: string,
    teamAssignments: Map<string, string>
  ): void {
    const sessionRoom = this.sessions.get(sessionId);
    if (!sessionRoom) return;

    sessionRoom.teams.clear();

    Array.from(this.socketToSession.entries())
      .filter(([_, sId]) => sId === sessionId)
      .forEach(([socketId, _]) => {
        this.socketToTeam.delete(socketId);
      });

    teamAssignments.forEach((teamId, playerId) => {
      const playerSockets = this.getPlayerSocketsInSession(playerId, sessionId);

      playerSockets.forEach((socketId) => {
        if (!sessionRoom.teams.has(teamId)) {
          sessionRoom.teams.set(teamId, new Set());
        }

        sessionRoom.teams.get(teamId)!.add(socketId);
        console.log(
          `Assigning socket ${socketId} to team ${teamId} for player ${playerId}`
        );
        this.socketToTeam.set(socketId, teamId);
      });
    });
    console.log("Session Room ", sessionRoom);

    console.log(`Team assignments updated for session ${sessionId}`);
  }

  async restoreSessionStates(): Promise<void> {
    try {
      const sessions = await SessionService.getSessionsByQuery({
        state: { $ne: SessionStates.COMPLETED },
      });

      for (const session of sessions) {
        const players = await PlayerService.getPlayersBySessionId(session._id);

        const teamAssignments = new Map<string, string>();
        players.forEach((player) => {
          if (player.teamId) {
            teamAssignments.set(
              player._id.toString(),
              player.teamId.toString()
            );
          }
        });

        if (teamAssignments.size > 0) {
          this.assignPlayersToTeams(session._id.toString(), teamAssignments);
        }
      }

      console.log(`Restored ${sessions.length} sessions with team formations`);
    } catch (error) {
      console.error("Error restoring session states:", error);
    }
  }
  private getPlayerSocketsInSession(
    playerId: string,
    sessionId: string
  ): string[] {
    const sessionRoom = this.sessions.get(sessionId);
    if (!sessionRoom) return [];

    const playerSockets = socketManager.getUserSockets(playerId);
    return playerSockets.filter((socketId) =>
      sessionRoom.allSockets.has(socketId)
    );
  }

  // Get all sockets in session
  getSessionSockets(sessionId: string): string[] {
    const sessionRoom = this.sessions.get(sessionId);
    return sessionRoom ? Array.from(sessionRoom.allSockets) : [];
  }

  // Get admin sockets in session
  getSessionAdmins(sessionId: string): string[] {
    const sessionRoom = this.sessions.get(sessionId);
    return sessionRoom ? Array.from(sessionRoom.admins) : [];
  }

  // Get player sockets in session
  getSessionPlayers(sessionId: string): string[] {
    const sessionRoom = this.sessions.get(sessionId);
    return sessionRoom ? Array.from(sessionRoom.players) : [];
  }

  // Get team sockets
  getTeamSockets(sessionId: string, teamId: string): string[] {
    const sessionRoom = this.sessions.get(sessionId);
    const teamSockets = sessionRoom?.teams.get(teamId);
    console.log("Session Room", sessionRoom);
    console.log("Session Room Teams", sessionRoom?.teams);
    return teamSockets ? Array.from(teamSockets) : [];
  }

  // Get all teams in session
  getSessionTeams(sessionId: string): string[] {
    const sessionRoom = this.sessions.get(sessionId);
    return sessionRoom ? Array.from(sessionRoom.teams.keys()) : [];
  }

  // Get session info
  getSessionInfo(sessionId: string) {
    const sessionRoom = this.sessions.get(sessionId);
    if (!sessionRoom) return null;

    return {
      sessionId,
      totalSockets: sessionRoom.allSockets.size,
      adminCount: sessionRoom.admins.size,
      playerCount: sessionRoom.players.size,
      teamCount: sessionRoom.teams.size,
      teams: Array.from(sessionRoom.teams.entries()).map(
        ([teamId, sockets]) => ({
          teamId,
          memberCount: sockets.size,
        })
      ),
    };
  }
}

export const roomManager = new RoomManager();
