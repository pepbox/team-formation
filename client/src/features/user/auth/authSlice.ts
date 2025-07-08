import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    id: string;
    role: "USER" | "ADMIN";
    name: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.createUser.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        const playerData = action.payload.data.player;
        state.user = {
          id: playerData._id,
          role: "USER",
          name: `${playerData.firstName} ${playerData.lastName}`,
        };
      }
    );
    builder.addMatcher(
      authApi.endpoints.fetchPlayer.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        const playerData = action.payload.data.player;
        state.user = {
          id: playerData._id,
          role: "USER",
          name: `${playerData.firstName} ${playerData.lastName}`,
        };
      }
    );
  },
});

export const authReducer = authSlice.reducer;
