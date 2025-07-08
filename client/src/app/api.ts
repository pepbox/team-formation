import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tagTypes } from './apiTags';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,     
    credentials: 'include', 
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    tagTypes: tagTypes,
    endpoints: () => ({}),
});