import { Avatar } from "@mui/material";
import { EnrichedPlayer } from "../../../session/teamsPlayersSlice";

const PlayerCard = ({
  player,
  isLeader = false,
}: {
  player: EnrichedPlayer;
  isLeader?: boolean;
}) => {
  console.log("PlayerCard", player, isLeader);
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2">
        {player.profileImage ? (
          <img
            src={player.profileImage}
            alt={player.firstName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <Avatar />
        )}
        {isLeader && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        )}
      </div>
      <span className="text-xs text-white text-center font-medium">
        {player.firstName} {player.lastName}
      </span>
    </div>
  );
};

export default PlayerCard;
