import { createSlice } from "@reduxjs/toolkit";
import { sessionApi } from "./sessionApi";

interface RawPlayer {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  teamId: string;
  votedLeader: string;
}

interface RawTeam {
  _id: string;
  teamNumber: number;
  teamName: string;
  leaderId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface EnrichedPlayer {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  teamInfo: {
    teamNumber: number;
    teamName: string;
  };
  votedLeader: string;
}

export interface EnrichedTeam {
  id: string;
  teamNumber: number;
  teamName: string;
  leader?: RawPlayer;
  players: any[];
}

interface TeamsPlayersState {
  players: RawPlayer[];
  teams: RawTeam[];
  enrichedPlayers: EnrichedPlayer[];
  enrichedTeams: EnrichedTeam[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamsPlayersState = {
  players: [],
  teams: [],
  enrichedPlayers: [],
  enrichedTeams: [],
  isLoading: false,
  error: null,
};

const teamsPlayersSlice = createSlice({
  name: "teamsPlayers",
  initialState,
  reducers: {
    clearData: (state) => {
      state.players = [];
      state.teams = [];
      state.enrichedPlayers = [];
      state.enrichedTeams = [];
      state.error = null;
    },
    enrichData: (state) => {
      if (state.players && state.teams) {
        state.enrichedPlayers = enrichPlayersData(state.players, state.teams);
        state.enrichedTeams = enrichTeamsData(state.teams, state.players);
      }
    },
  },
  extraReducers: (builder) => {
    // Handle players data
    builder
      .addMatcher(
        sessionApi.endpoints.fetchAllPlayersData.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        sessionApi.endpoints.fetchAllPlayersData.matchFulfilled,
        (state, action) => {
          state.players = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        sessionApi.endpoints.fetchAllPlayersData.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || "Failed to fetch players data";
        }
      );

    // Handle teams data
    builder
      .addMatcher(
        sessionApi.endpoints.fetchAllTeamsData.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        sessionApi.endpoints.fetchAllTeamsData.matchFulfilled,
        (state, action) => {
          state.teams = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        sessionApi.endpoints.fetchAllTeamsData.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || "Failed to fetch teams data";
        }
      );
  },
});

// Helper functions to enrich data
const enrichPlayersData = (
  players: RawPlayer[],
  teams: RawTeam[]
): EnrichedPlayer[] => {
  return players.map((player) => {
    const team = teams.find((team) => team._id === player.teamId);
    return {
      _id: player._id,
      firstName: player.firstName,
      lastName: player.lastName,
      profileImage: player.profileImage,
      votedLeader: player.votedLeader,
      teamInfo: team
        ? {
            teamNumber: team.teamNumber,
            teamName: team.teamName,
          }
        : {
            teamNumber: 0,
            teamName: "No Team",
          },
    };
  });
};

const enrichTeamsData = (
  teams: RawTeam[],
  players: RawPlayer[]
): EnrichedTeam[] => {
  return teams.map((team) => ({
    id: team._id,
    teamNumber: team.teamNumber,
    teamName: team.teamName,
    leader: players.find((player) => player._id === team.leaderId?._id),
    players: players.filter((player) => player.teamId === team._id),
  }));
};

export const { clearData, enrichData } = teamsPlayersSlice.actions;
export const teamsPlayersReducer = teamsPlayersSlice.reducer;

// Selectors
export const selectTeamsPlayersData = (state: {
  teamsPlayers: TeamsPlayersState;
}) => state.teamsPlayers;
export const selectEnrichedPlayers = (state: {
  teamsPlayers: TeamsPlayersState;
}) => state.teamsPlayers.enrichedPlayers;
export const selectEnrichedTeams = (state: {
  teamsPlayers: TeamsPlayersState;
}) => state.teamsPlayers.enrichedTeams;
export const selectTeamsPlayersLoading = (state: {
  teamsPlayers: TeamsPlayersState;
}) => state.teamsPlayers.isLoading;
export const selectTeamsPlayersError = (state: {
  teamsPlayers: TeamsPlayersState;
}) => state.teamsPlayers.error;
export const selectRawPlayers = (state: { teamsPlayers: TeamsPlayersState }) =>
  state.teamsPlayers.players;
export const selectRawTeams = (state: { teamsPlayers: TeamsPlayersState }) =>
  state.teamsPlayers.teams;
export const selectIsDataEnriched = (state: {
  teamsPlayers: TeamsPlayersState;
}) =>
  state.teamsPlayers.enrichedPlayers.length > 0 &&
  state.teamsPlayers.enrichedTeams.length > 0;
