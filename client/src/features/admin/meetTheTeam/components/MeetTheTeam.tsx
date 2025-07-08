import { useTeamsData } from "../../../session/useTeamsPlayersData";
import TeamCard from "./TeamCard";
import meetTheTeamsBg from "../../../../assets/images/backgrounds/meet-the-teams-bg.webp";
import BackButton from "../../../../components/utility/BackButton";

const MeetTheTeam = () => {
  const { teams: teamsData, isLoading } = useTeamsData();

  if (isLoading) return <div>Loading teams...</div>;
  return (
    <div
      className="min-h-screen p-6 font-mono"
      style={{
        backgroundImage: `url(${meetTheTeamsBg})`,
        backgroundSize: "cover",
      }}
    >
      <BackButton className="text-white" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meet the Teams</h1>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamsData.map((team, index) => (
            <TeamCard key={index} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetTheTeam;
