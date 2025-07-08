import { Avatar } from "@mui/material";
import VotingArrow from "../../../../assets/images/icons/voting-arrow.webp";

interface VotingMemberCardProps {
  playerName: string;
  profileImage?: string | null;
  myVoted?: boolean;
  votes?: number;
  onVote?: () => void;
  isMe?: boolean;
  disabled?: boolean;
}

const VotingMemberCard: React.FC<VotingMemberCardProps> = ({
  playerName,
  profileImage,
  myVoted = false,
  votes = 0,
  onVote,
  isMe = false,
  disabled = false,
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
          {isMe && <span className="font-normal text-[12px]">[You]</span>}
        </p>
      </div>
      <div className="flex gap-2 items-center mr-2">
        <img className="h-[25px]" src={VotingArrow} alt="Votes" />
        <p className="text-white">{votes}</p>
        <button
          className={`w-[52px] h-[33px] text-[14px] rounded-[12px] text-white transition-colors ${
            myVoted || disabled 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#1E89E0] hover:bg-[#1670c7]"
          }`}
          onClick={onVote}
          disabled={myVoted || disabled}
        >
          {disabled ? "..." : "Vote"}
        </button>
      </div>
    </div>
  );
};

export default VotingMemberCard;
