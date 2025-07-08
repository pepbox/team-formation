import { api } from "../../../app/api";

const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    changeTeamName: build.mutation({
      query: ({ teamName, teamId }) => ({
        url: "/admin/change-teamname",
        method: "POST",
        body: { teamName, teamId },
      }),
    }),
  }),
});

export const { useChangeTeamNameMutation } = dashboardApi;
