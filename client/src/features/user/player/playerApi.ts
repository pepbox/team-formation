import { api } from "../../../app/api";
import { API_TAGS } from "../../../app/apiTags";

const playerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchMyTeam: builder.query({
      query: () => ({
        url: "/user/player/fetch-my-team",
        method: "GET",
      }),
    }),
    fetchMyTeamPlayerVotes: builder.query({
      query: () => ({
        url: "/user/player/fetch-teamplayers-votes",
        method: "GET",
      }),
      providesTags: [API_TAGS.TEAM_PLAYER_VOTES],
    }),
    voteForLeader: builder.mutation({
      query: ({ votedLeaderId }) => ({
        url: "/user/player/vote-for-leader",
        method: "POST",
        body: { votedLeaderId },
      }),
      invalidatesTags: [API_TAGS.TEAM_PLAYER_VOTES],
    }),
    logoutPlayer: builder.mutation({
      query: () => ({
        url: "/user/player/logoutPlayer",
        method: "POST",
      }),
    }),
    assignTeamName: builder.mutation({
      query: ({ teamName }) => ({
        url: "/user/player/assign-teamname",
        method: "POST",
        body: { teamName },
      }),
      invalidatesTags: [API_TAGS.PLAYER],
    }),

    fetchAllTeams: builder.query({
      query: () => ({
        url: "/user/player/fetch-all-teams",
        method: "GET",
      }),
    }),
    fetchParticularTeam: builder.query({
      query: (teamId) => ({
        url: `/user/player/fetch-particular-team?teamId=${teamId}`,
        method: "GET",
      }),
    }),

    continueToGame: builder.mutation({
      query: () => ({
        url: "/user/player/continue-to-game",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLazyFetchMyTeamQuery,
  useFetchMyTeamQuery,
  useFetchMyTeamPlayerVotesQuery,
  useLogoutPlayerMutation,
  useVoteForLeaderMutation,
  useAssignTeamNameMutation,
  useFetchAllTeamsQuery,
  useFetchParticularTeamQuery,
  useContinueToGameMutation
} = playerApi;

export { playerApi };
