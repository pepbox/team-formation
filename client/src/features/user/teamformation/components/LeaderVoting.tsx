import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../app/store";
import VotingMemberCard from "./VotingMemberCard";
import {
  useFetchMyTeamPlayerVotesQuery,
  useVoteForLeaderMutation,
} from "../../player/playerApi";
import { setLeader, setVotedLeader } from "../../player/playerSlice";
import VotingTimer from "../../../session/components/VotingTimer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SessionStates } from "../../../session/types/sessionStates";

const LeaderVoting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teamNumber, votedLeader, _id } = useSelector(
    (state: RootState) => state.player
  );
  const [voteForLeader, { isLoading }] = useVoteForLeaderMutation();
  const { sessionId, state } = useSelector((state: RootState) => state.session);
  const { data, refetch } = useFetchMyTeamPlayerVotesQuery(undefined);
  const teamMembers = data?.data?.teamPlayersWithVotes || [];

  const handleVote = async (memberId: string) => {
    if (isLoading || votedLeader === memberId) return;
    try {
      dispatch(setVotedLeader(memberId));
      await voteForLeader({ votedLeaderId: memberId }).unwrap();
    } catch (error) {
      console.error("Error voting for leader:", error);
      dispatch(setVotedLeader(votedLeader));
    }
  };

  const handleTimerComplete = () => {
    refetch();
  };

  useEffect(() => {
    if (data?.data.chosenLeader) {
      const chosenLeader = data.data.chosenLeader;
      dispatch(setLeader({ teamLeaderId: chosenLeader._id }));
    }
  }, [data]);

  useEffect(() => {
    if (state === SessionStates.FINAL) {
      navigate(`/user/${sessionId}/our-captain`);
    }
  }, []);

  return (
    <div className="p-4">
      <p className="text-[24px] mt-4 font-mono font-bold text-white text-center">
        Voting
      </p>
      <p className="text-[16px] font-mono text-white text-center">
        Team - {teamNumber?.toString().padStart(3, "0")}
      </p>
      <div className="mt-4 text-white">
        <VotingTimer onTimerCompleted={handleTimerComplete} />
      </div>
      {/* <div className="w-[100%] flex justify-between mt-2">
        <div className="h-[20px] w-[70%] bg-white rounded-full flex items-center ">
          <div
            className="h-[16px] bg-[#1E89E0] rounded-full ml-[2px] mr-[2px]"
            style={{
              width: `${
                (players.reduce((sum, player) => sum + player.votes, 0) /
                  (players.length * 2)) *
                100
              }%`,
            }}
          ></div>
        </div>
        <div className="flex items-center">
          <p className="text-[12px] font-mono text-white ">
            {formatTime(timeLeft)} Left
          </p>
        </div>
      </div> */}
      <div className="flex flex-col gap-1 mt-1">
        {teamMembers?.map((member: any) => (
          <VotingMemberCard
            key={member._id}
            playerName={member.firstName + " " + member.lastName}
            profileImage={member.profileImage}
            myVoted={votedLeader === member._id}
            votes={member.votes}
            onVote={() => handleVote(member._id)}
            isMe={member._id === _id}
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaderVoting;
