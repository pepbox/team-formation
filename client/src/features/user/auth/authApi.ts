import { api } from "../../../app/api";
import { API_TAGS } from "../../../app/apiTags";
import { objectToFormData } from "../../../utility/objectToFormData";

interface CreateUserData {
  firstName: string;
  lastName: string;
  sessionId: string;
  profilePicture?: File | null;
}
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userData: CreateUserData) => {
        const formData = objectToFormData(userData);
        return {
          url: "/user/player/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [API_TAGS.SESSION],
    }),
    fetchPlayer: builder.query({
      query: () => ({
        url: `/user/player/fetch`,
        method: "GET",
      }),
      providesTags:[API_TAGS.PLAYER],
    }),
  }),
});

export const { useCreateUserMutation, useFetchPlayerQuery } = authApi;
