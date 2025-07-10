import { useTeamsData } from "../../../session/useTeamsPlayersData";
import teamCaptainsBg from "../../../../assets/images/backgrounds/team-captains-bg.webp";
import CaptainCard from "./CaptainCard";
import BackButton from "../../../../components/utility/BackButton";
import useAdminSessionNavigate from "../../../../hooks/useAdminNavigate";

const TeamCaptains = () => {
  const { teams: teamsData, isLoading } = useTeamsData();
  const { adminSessionBasePath } = useAdminSessionNavigate();

  if (isLoading) return <div>Loading teams...</div>;
  return (
    <div
      className="min-h-screen p-6 font-mono"
      style={{
        backgroundImage: `url(${teamCaptainsBg})`,
        backgroundSize: "cover",
      }}
    >
      <BackButton
        className="text-white"
        backPath={`${adminSessionBasePath}/dashboard`}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Team Captains</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamsData.map((team, index) => (
            <CaptainCard key={index} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamCaptains;
