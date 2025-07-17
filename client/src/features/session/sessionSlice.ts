import { createSlice } from "@reduxjs/toolkit";
import { Session } from "./types/session";
import { sessionApi } from "./sessionApi";

const initialState: Session = {
  sessionId: null,
  sessionName: null,
  paused: false,
  state: null,
  gameLinked: false,
  votingStartTime: null,
  votingDuration: null,
  teamType: null,
  numberOfTeams: 0,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    updateSession: (state, action) => {
      const {
        sessionId,
        state: sessionState,
        paused,
        sessionName,
      } = action.payload;
      state.paused = paused ?? state.paused;
      state.sessionId = sessionId ?? state.sessionId;
      state.state = sessionState ?? state.state;
      state.sessionName = sessionName ?? state.sessionName;
      state.votingStartTime = action.payload.votingStartTime
        ? new Date(action.payload.votingStartTime)
        : state.votingStartTime;
      state.votingDuration =
        action.payload.votingDuration ?? state.votingDuration;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      sessionApi.endpoints.fetchSessionState.matchFulfilled,
      (state, action) => {
        const {
          state: sessionState,
          paused,
          votingStartTime,
          sessionName,
          votingDuration,
        } = action.payload.data;
        state.paused = paused;
        state.state = sessionState;
        state.teamType = action.payload.data.teamType || null; // Ensure teamType is set
        state.gameLinked = action.payload.data.gameLinked || false;
        state.sessionId = action.payload.data._id;
        state.sessionName = sessionName || null;
        state.votingStartTime = votingStartTime
          ? new Date(votingStartTime)
          : null;
        state.votingDuration = votingDuration || null;
        state.numberOfTeams = action.payload.data.numberOfTeams || 0; // Ensure numberOfTeams is set
      }
    );
  },
});

export const { updateSession } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
