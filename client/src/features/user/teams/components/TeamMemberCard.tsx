import { Avatar } from "@mui/material";
import CrownIcon from "../../../../assets/images/icons/crown.webp";

interface TeamMemberCardProps {
  playerName: string;
  profileImage?: string | null;
  isCaptain?: boolean;
  isMe?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  playerName,
  profileImage,
  isCaptain = false,
  isMe = false,
}) => {
  return (
    <div className="py-2 px-4 bg-[#6B6694CC]/80 rounded-[12px] backdrop-blur-[2px] flex items-center justify-between mt-3">
      <div className="flex items-center gap-3">
        <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="" className="w-full h-full" />
          ) : (
            <Avatar />
          )}
        </div>
        <p className="font-bold text-white text-[14px] font-mono">
          {playerName}{" "}
          {isCaptain && <span className="font-normal text-[12px]">[C]</span>}
          {isMe && <span className="font-normal text-[12px]">[You]</span>}
        </p>
      </div>
      {isCaptain && (
        <div>
          <img src={CrownIcon} className="w-8" />
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
