import { api } from "../../../app/api";
import { API_TAGS } from "../../../app/apiTags";

export const adminSessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startTeamFormation: builder.mutation({
      query: ({ numberOfTeams }) => ({
        url: "/admin/session/start-team-formation",
        method: "POST",
        body: { numberOfTeams },
      }),
      invalidatesTags: [API_TAGS.ALL_PLAYERS, API_TAGS.ALL_TEAMS],
    }),
    startLeaderVoting: builder.mutation({
      query: ({ votingDuration }) => ({
        url: "/admin/session/start-leader-voting",
        method: "POST",
        body: { votingDuration },
      }),
      invalidatesTags: [API_TAGS.ALL_PLAYERS, API_TAGS.ALL_TEAMS],
    }),
    adminContinueToGame: builder.mutation({
      query: () => ({
        url: "/admin/session/finish-session",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useStartTeamFormationMutation,
  useStartLeaderVotingMutation,
  useAdminContinueToGameMutation,
} = adminSessionApi;
