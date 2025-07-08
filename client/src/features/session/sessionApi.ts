import { api } from "../../app/api";
import { API_TAGS } from "../../app/apiTags";

export const sessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchSessionState: builder.query({
      query: () => ({
        url: `/common/session/fetch-session-state`,
        method: "GET",
      }),
      providesTags: [API_TAGS.SESSION],
    }),
    fetchAllTeamsData: builder.query({
      query: () => ({
        url: `/common/session/fetch-all-teams`,
        method: "GET",
      }),
      providesTags: [API_TAGS.ALL_TEAMS],
    }),
    fetchAllPlayersData: builder.query({
      query: () => ({
        url: `/common/session/fetch-all-players`,
        method: "GET",
      }),
      providesTags: [API_TAGS.ALL_PLAYERS],
    }),
  }),
});

export const {
  useFetchSessionStateQuery,
  useFetchAllTeamsDataQuery,
  useFetchAllPlayersDataQuery,
} = sessionApi;
