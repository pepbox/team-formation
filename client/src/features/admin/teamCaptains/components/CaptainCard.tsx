import { Avatar } from "@mui/material";
import { EnrichedTeam } from "../../../session/teamsPlayersSlice";
import starsIcon from "../../../../assets/images/three-stars.webp";

const CaptainCard = ({ team }: { team: EnrichedTeam }) => {
  const leader = team.leader;

  return (
    <div
      className="bg-[#5985C8]/40 rounded-lg p-6"
      style={{ boxShadow: "0 0 12px #ffffff38" }}
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
            <span className="text-white text-2xl mt-4 font-bold">
              {leader.firstName} {leader.lastName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainCard;
