import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { SessionStates } from "../../session/types/sessionStates";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../../pages/user/auth/LoginPage";
import TeamSelection from "../../../pages/user/teamFormation/TeamSelection";
import MyTeam from "../../../pages/user/teams/MyTeam";
import LeaderVoting from "../../../pages/user/teamFormation/LeaderVoting";
import OurCaptain from "../../../pages/user/teamFormation/OurCaptain";
import NameYourTeam from "../../../pages/user/teamFormation/NameYourTeam";
import AllTeams from "../../../pages/user/teams/AllTeams";
import OtherTeam from "../../../pages/user/teams/OtherTeam";
import { RouteConfig } from "./types/routeConfig";
import RoutingRedirection from "./RouteRedirection";

const routeConfigs: RouteConfig[] = [
  {
    path: "login",
    element: LoginPage,
    allowedStates: [SessionStates.TEAM_JOINING],
  },
  {
    path: "team-formation",
    element: TeamSelection,
    allowedStates: [SessionStates.TEAM_JOINING, SessionStates.TEAM_FORMATION],
  },
  {
    path: "my-team",
    element: MyTeam,
    allowedStates: [
      SessionStates.TEAM_FORMATION,
      SessionStates.FINAL,
      SessionStates.COMPLETED,
    ],
  },
  {
    path: "leader-voting",
    element: LeaderVoting,
    allowedStates: [SessionStates.LEADER_VOTING],
  },
  {
    path: "our-captain",
    element: OurCaptain,
    allowedStates: [SessionStates.LEADER_VOTING, SessionStates.FINAL],
  },
  {
    path: "name-your-team",
    element: NameYourTeam,
    allowedStates: [SessionStates.LEADER_VOTING, SessionStates.FINAL],
  },
  {
    path: "all-teams",
    element: AllTeams,
    allowedStates: [SessionStates.FINAL,SessionStates.COMPLETED],
  },
  {
    path: "team/:teamId",
    element: OtherTeam,
    allowedStates: [SessionStates.FINAL,SessionStates.COMPLETED],
  },
];

const defaultRoutes: Record<SessionStates, string> = {
  [SessionStates.TEAM_JOINING]: "login",
  [SessionStates.TEAM_FORMATION]: "team-formation",
  [SessionStates.LEADER_VOTING]: "leader-voting",
  [SessionStates.FINAL]: "our-captain",
  [SessionStates.COMPLETED]: "my-team",
};

const SessionRouter = () => {
  const { state } = useSelector((state: RootState) => state.session);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { sessionId } = useSelector((state: RootState) => state.session);

  if (!state || !isAuthenticated) {
    return <Navigate to={`/user/${sessionId}/login`} replace />;
  }

  const fallbackPath = defaultRoutes[state];

  console.log("Current session state:", state);

  return (
    <Routes>
      {routeConfigs.map(({ path, element, allowedStates }) => (
        <Route
          key={path}
          path={path}
          element={
            <RoutingRedirection
              element={element}
              allowedStates={allowedStates}
              currentState={state}
              fallbackPath={fallbackPath}
            />
          }
        />
      ))}
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  );
};

export default SessionRouter;
