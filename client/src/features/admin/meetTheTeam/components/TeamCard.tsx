import { Avatar } from "@mui/material";
import PlayerCard from "./PlayerCard";
import { EnrichedTeam } from "../../../session/teamsPlayersSlice";
import starsIcon from "../../../../assets/images/three-stars.webp";

const TeamCard = ({ team }: { team: EnrichedTeam }) => {
  const leader = team.leader;

  return (
    <div
      className="bg-gradient-to-br bg-[#B38DB4]/40 rounded-lg p-6"
      style={{ boxShadow: "0 0 12px #b38db487" }}
    >
      {/* Team Header */}
      <div className="text-center mb-6">
        <h3 className="text-white text-lg font-bold mb-2">
          Team {team.teamNumber} - {team.teamName}
        </h3>
        {/* Leader Section */}
        {leader && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              {leader.profileImage ? (
                <img
                  src={leader.profileImage}
                  alt={leader.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <Avatar />
              )}
              {/* Crown/Star for leader */}
              <div className="absolute w-14 -bottom-4 left-1/2 transform -translate-x-1/2">
                <img src={starsIcon} alt=""/>
              </div>
            </div>
            <span className="text-white text-md mt-4 font-medium">
              {leader.firstName} {leader.lastName}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {team.players
          ?.filter((p) => p._id != team.leader?._id)
          ?.map((player, index) => (
            <PlayerCard key={index} player={player} />
          ))}
      </div>
    </div>
  );
};

export default TeamCard;
