import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import GamePaused from "./components/GamePaused";
import Page from "../../../components/layout/Page";
import { SessionStates } from "../../session/types/sessionStates";
// import TeamNamingInProgress from "./components/TeamNamingInProgress";

const Overlays = () => {
  const { paused, state } = useSelector((state: RootState) => state.session);
  // const { _id, teamLeaderId } = useSelector((state: RootState) => state.player);
  let OverlayComponent;

  if (paused || state === SessionStates.TEAM_JOINING) {
    OverlayComponent = GamePaused;
  }

  // if (_id !== teamLeaderId && state === SessionStates.LEADER_VOTING) {
  //   OverlayComponent = TeamNamingInProgress;
  // }

  if (OverlayComponent)
    return (
      <Page
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#23203ea9",
          backdropFilter: "blur(2px)",
          zIndex: 9999,
        }}
      >
        <div className="flex-1 inset-0 z-50 flex items-center justify-center">
          <OverlayComponent />
        </div>
      </Page>
    );
  else {
    return null;
  }
};

export default Overlays;
