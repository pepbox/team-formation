import { Route, Routes, useParams } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { updateSession } from "../../features/session/sessionSlice";
import DefaultUserPage from "./DefaultUserPage";
import SessionRouter from "../../features/user/sessionRouting/SessionRouter";
import bgMain from "../../assets/images/backgrounds/bg-main.png";
import Page from "../../components/layout/Page";
import { useFetchPlayerQuery } from "../../features/user/auth/authApi";
import { useFetchSessionStateQuery } from "../../features/session/sessionApi";
import Overlays from "../../features/user/overlays/Overlays";
import { useSelector } from "react-redux";
import { useLazyFetchMyTeamQuery } from "../../features/user/player/playerApi";
import { SessionStates } from "../../features/session/types/sessionStates";

const UserMain = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { state } = useSelector((state: RootState) => state.session);
  const { sessionId } = useParams<{ sessionId: string }>();
  const { isLoading } = useFetchPlayerQuery(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isSessionLoading } = useFetchSessionStateQuery(undefined);
  const [fetchMyTeam] = useLazyFetchMyTeamQuery();

  useEffect(() => {
    if (sessionId) {
      dispatch(updateSession({ sessionId }));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (
      state &&
      [SessionStates.FINAL, SessionStates.LEADER_VOTING].includes(state)
    ) {
      fetchMyTeam(undefined);
    }
  }, [state]);
  if (!sessionId) {
    return <DefaultUserPage />;
  }

  if (isLoading || isSessionLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {isAuthenticated && <Overlays />}

      <Page
        sx={{
          backgroundImage: `url(${bgMain})`,
          backgroundSize: "fill",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="/*" element={<SessionRouter />} />
        </Routes>
      </Page>
    </>
  );
};

export default UserMain;
