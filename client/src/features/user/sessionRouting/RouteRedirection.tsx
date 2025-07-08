import { Navigate } from "react-router-dom";
import { SessionStates } from "../../session/types/sessionStates";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const RoutingRedirection: React.FC<{
  element: React.ComponentType;
  allowedStates: SessionStates[];
  currentState: SessionStates;
  fallbackPath: string;
}> = ({ element: Element, allowedStates, currentState, fallbackPath }) => {
  const { sessionId } = useSelector((state: RootState) => state.session);
  if (!sessionId) {
    return null; // or a loading spinner
  }

  if (allowedStates.includes(currentState)) {
    return <Element />;
  }

  const redirectPath = fallbackPath.startsWith("/")
    ? fallbackPath
    : `/user/${sessionId}/${fallbackPath}`;

  return <Navigate to={redirectPath} replace />;
};

export default RoutingRedirection;
