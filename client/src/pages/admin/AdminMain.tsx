import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import AdminLogin from "./auth/AdminLogin";
import MeetTheTeams from "./teamsInfo/MeetTheTeams";
import TeamCaptains from "./teamsInfo/TeamCaptains";
import { useEffect } from "react";
import { updateSession } from "../../features/session/sessionSlice";
import { enrichData } from "../../features/session/teamsPlayersSlice";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import AdminProtectedRoute from "../../features/admin/auth/components/AdminProtectedRoute";
import { useFetchAdminQuery } from "../../features/admin/auth/adminAuthApi";
import {
  useFetchSessionStateQuery,
  useFetchAllTeamsDataQuery,
  useFetchAllPlayersDataQuery,
} from "../../features/session/sessionApi";

const AdminMain = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth
  );

  const { isLoading } = useFetchAdminQuery(sessionId);

  const { isLoading: isSessionLoading } = useFetchSessionStateQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: teamsData, isLoading: isTeamsLoading } =
    useFetchAllTeamsDataQuery(undefined, {
      skip: !isAuthenticated,
    });
  const { data: playersData, isLoading: isPlayersLoading } =
    useFetchAllPlayersDataQuery(undefined, {
      skip: !isAuthenticated,
    });

  useEffect(() => {
    if (sessionId) {
      dispatch(updateSession({ sessionId }));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (
      isAuthenticated &&
      teamsData?.data &&
      playersData?.data &&
      !isTeamsLoading &&
      !isPlayersLoading
    ) {
      dispatch(enrichData());
    }
  }, [
    dispatch,
    isAuthenticated,
    teamsData,
    playersData,
    isTeamsLoading,
    isPlayersLoading,
  ]);
  const isDataLoading =
    isAuthenticated && (isSessionLoading || isTeamsLoading || isPlayersLoading);
  const isAnyLoading = isLoading || isDataLoading;

  if (isAnyLoading) {
    return <>Loading...</>;
  }
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meet-the-teams" element={<MeetTheTeams />} />
        <Route path="/team-captains" element={<TeamCaptains />} />
        <Route
          path="/*"
          element={<Navigate to={`/admin/${sessionId}/dashboard`} />}
        />
      </Route>
    </Routes>
  );
};

export default AdminMain;
