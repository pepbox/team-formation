import { useFetchMyTeamQuery } from "../../player/playerApi";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTeam } from "../../player/playerSlice";
import TeamMemberCard from "./TeamMemberCard";
import { SessionStates } from "../../../session/types/sessionStates";
import { useNavigate } from "react-router-dom";
import ContinueToGameButton from "./ContinueToGameButton";

const MyTeamList = () => {
  const { data } = useFetchMyTeamQuery(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state, sessionId } = useSelector((state: RootState) => state.session);
  const { teamMembers, teamName, teamNumber, teamLeaderId, _id } = useSelector(
    (state: RootState) => state.player
  );

  useEffect(() => {
    dispatch(
      setTeam({
        // teamName: data?.data.teamInfo.teamName || "",
        // teamNumber: data?.data.teamInfo.teamNumber || null,
        teamMembers: data?.data.teamPlayers || [],
      })
    );
  }, [data]);

  useEffect(() => {
    if (
      state === SessionStates.FINAL &&
      [null, ""].includes(teamName) &&
      _id === teamLeaderId
    ) {
      navigate(`/user/${sessionId}/name-your-team`);
    }
  }, [state]);

  return (
    <div className="flex flex-col flex-1  items-center justify-between py-10 pb-20 mx-6">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex">
          <p className="text-[20px] font-bold font-mono text-white text-center self-center w-full">
            Team - {teamNumber?.toString().padStart(3, "0")}{" "}
            {teamName ? `- ${teamName}` : null}
          </p>
        </div>
        {teamMembers?.map((member) => (
          <TeamMemberCard
            key={member._id}
            profileImage={member.profileImage}
            playerName={member.firstName + " " + member.lastName}
            isCaptain={member._id === teamLeaderId}
            isMe={member._id === _id}
          />
        ))}
      </div>
      <div className="fixed bottom-6 flex flex-col gap-2 w-full px-4 max-w-[480px] ">
        {(state === SessionStates.FINAL ||
          state === SessionStates.COMPLETED) && (
          <button
            className="flex-1 bg-white text-black py-2 h-[40px] rounded-[12px] text-center font-mono"
            onClick={() => navigate(`/user/${sessionId}/all-teams`)}
          >
            View all Teams
          </button>
        )}
        {state === SessionStates.COMPLETED && <ContinueToGameButton />}
      </div>
    </div>
  );
};

export default MyTeamList;
