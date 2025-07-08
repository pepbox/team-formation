import { api } from "../../../app/api";

export const adminAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: ({ password, sessionId }) => {
        return {
          url: "/admin/login",
          method: "POST",
          body: { password, sessionId },
        };
      },
    }),
    fetchAdmin: builder.query({
      query: (sessionId) => ({
        url: "/admin/fetch",
        method: "GET",
        params: { sessionId },
      }),
    }),

    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useFetchAdminQuery,
  useLogoutAdminMutation,
} = adminAuthApi;
