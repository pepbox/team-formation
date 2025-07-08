import { createSlice } from "@reduxjs/toolkit";
import { adminAuthApi } from "./adminAuthApi";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    id: string;
    name: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  user: null,
};

const adminAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      adminAuthApi.endpoints.loginAdmin.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        const adminData = action.payload.data.admin;
        if (adminData) {
          state.user = {
            id: adminData._id,
            name: adminData.name || state.user?.name,
          };
        }
      }
    );
    builder.addMatcher(
      adminAuthApi.endpoints.fetchAdmin.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        const adminData = action.payload.data;
        if (adminData) {
          state.user = {
            id: adminData._id,
            name: adminData.name || state.user?.name,
          };
        }
      }
    );
    builder.addMatcher(
      adminAuthApi.endpoints.logoutAdmin.matchFulfilled,
      (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      }
    );
  },
});

export const adminAuthReducer = adminAuthSlice.reducer;
