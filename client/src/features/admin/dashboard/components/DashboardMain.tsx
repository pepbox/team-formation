import Header from "./Header";
import PlayersData from "./PlayersData";
import Topbar from "./Topbar";
import { useState } from "react";
import TeamsData from "./TeamsData";
import { SessionStates } from "../../../session/types/sessionStates";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { useTeamsPlayersData } from "../../../session/useTeamsPlayersData";

export type TabId = "players" | "teams";
export type Tab = { id: TabId; name: string; show: boolean };

const DashboardMain = () => {
  const [activeTab, setActiveTab] = useState<TabId>("players");
  const { state } = useSelector((state: RootState) => state.session);
  
  // Get enriched data using custom hook
  const { players: enrichedPlayerData, teams: enrichedTeamsData } = useTeamsPlayersData();

  const tabs: Tab[] = [
    { id: "players", name: "Players", show: true },
    {
      id: "teams",
      name: "Teams",
      show: state !== SessionStates.TEAM_JOINING,
    },
  ];

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div>
      <Header />
      <Topbar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "players" && <PlayersData data={enrichedPlayerData} />}
      {activeTab === "teams" && <TeamsData data={enrichedTeamsData} />}
    </div>
  );
};

export default DashboardMain;
