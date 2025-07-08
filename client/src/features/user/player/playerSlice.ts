import { createSlice } from "@reduxjs/toolkit";
import { Player } from "./types/player";
import { authApi } from "../auth/authApi";
import { playerApi } from "./playerApi";

const initialState: Player = {
  _id: "",
  firstName: "",
  lastName: "",
  profileImage: null,
  teamName: "",
  votedLeader: null,
  teamNumber: null,
  teamMembers: null,
  teamLeaderId: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setTeam: (state, action) => {
      state.teamName = action.payload.teamName ?? state.teamName;
      state.teamNumber = action.payload.teamNumber ?? state.teamNumber;
      state.teamMembers = action.payload.teamMembers ?? state.teamMembers;
    },
    setVotedLeader: (state, action) => {
      state.votedLeader = action.payload;
    },
    setLeader: (state, action) => {
      state.teamLeaderId = action.payload.teamLeaderId ?? state.teamLeaderId;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.fetchPlayer.matchFulfilled,
        (state, action) => {
          const playerData = action.payload.data.player;

          if (playerData) {
            state._id = playerData._id ?? state._id;
            state.firstName = playerData.firstName ?? state.firstName;
            state.lastName = playerData.lastName ?? state.lastName;
            state.profileImage =
              playerData.profileImage.location ?? state.profileImage;
            state.votedLeader = playerData.votedLeader ?? state.votedLeader;
            if (playerData.teamId) {
              state.teamNumber =
                playerData.teamId.teamNumber ?? state.teamNumber;
              state.teamLeaderId =
                playerData.teamId.leaderId ?? state.teamLeaderId;
              state.teamName = playerData.teamId.teamName ?? state.teamName;
            }
          }
        }
      )
      .addMatcher(
        playerApi.endpoints.voteForLeader.matchFulfilled,
        (state, action) => {
          if (action.meta.arg.originalArgs) {
            state.votedLeader = action.meta.arg.originalArgs.votedLeaderId;
          }
        }
      )
      .addMatcher(
        playerApi.endpoints.fetchMyTeam.matchFulfilled,
        (state, action) => {
          const teamData = action.payload.data;
          console.log("Here is what we got", action.payload);
          if (teamData) {
            state.teamMembers = teamData.teamPlayers;
            state.teamName = teamData.teamInfo.teamName;
            state.teamLeaderId = teamData.teamInfo.leaderId;
          }
        }
      );
  },
});

export const { setTeam, setVotedLeader, setLeader } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
