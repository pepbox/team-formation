import { SessionStates } from "../../../session/types/sessionStates";
import { TabId } from "./DashboardMain";
import StartTeamFormation from "../../session/components/StartTeamFormation";
import { RootState } from "../../../../app/store";
import { useSelector } from "react-redux";
import StartLeaderVoting from "../../session/components/StartLeaderVoting";
import VotingInProgress from "../../session/components/VotingInProgress";
import ContinueToGame from "../../session/components/ContinueToGame";

interface TopbarProps {
  tabs: { id: TabId; name: string; show: boolean }[];
  activeTab: string;
  setActiveTab: (tabId: TabId) => void;
}

const Topbar: React.FC<TopbarProps> = ({ tabs, activeTab, setActiveTab }) => {
  const { state: sessionState, gameLinked } = useSelector(
    (state: RootState) => state.session
  );

  const renderControls = () => {
    if (sessionState === SessionStates.TEAM_JOINING) {
      return <StartTeamFormation />;
    } else if (sessionState === SessionStates.TEAM_FORMATION) {
      return <StartLeaderVoting />;
    } else if (sessionState === SessionStates.LEADER_VOTING) {
      return <VotingInProgress />;
    } else if (
      (sessionState === SessionStates.FINAL ||
        sessionState === SessionStates.COMPLETED) &&
      gameLinked
    ) {
      return <ContinueToGame />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-2 gap-4 md:gap-0">
      <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
      {tabs.map(
        (tab, index) =>
        tab.show && (
          <button
          key={index}
          onClick={() => setActiveTab(tab.id)}
          className={`border-1 px-4 py-2 border-black rounded-lg cursor-pointer ${
            activeTab === tab.id ? "" : "opacity-50"
          }`}
          >
          {tab.name}
          </button>
        )
      )}
      </div>
      {/* Controls */}
      <div className="w-full md:w-auto flex justify-center md:justify-end">
      {renderControls()}
      </div>
    </div>
  );
};

export default Topbar;
