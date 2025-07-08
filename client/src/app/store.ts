import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { playerReducer } from "../features/user/player/playerSlice";
import { sessionReducer } from "../features/session/sessionSlice";
import { authReducer } from "../features/user/auth/authSlice";
import { adminAuthReducer } from "../features/admin/auth/adminAuthSlice";
import { teamsPlayersReducer } from "../features/session/teamsPlayersSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    session: sessionReducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
    teamsPlayers: teamsPlayersReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
