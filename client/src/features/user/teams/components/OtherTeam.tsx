import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../../app/store";
import { useFetchParticularTeamQuery } from "../../player/playerApi";
import TeamMemberCard from "./TeamMemberCard";
import { ArrowBack } from "@mui/icons-material";

const OtherTeam = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { sessionId } = useSelector((state: RootState) => state.session);
  const { data, isLoading } = useFetchParticularTeamQuery(teamId || "");
  if (!teamId) {
    return <Navigate to={`/user/${sessionId}/my-team`} replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const { players, teamName, teamNumber, leaderId, _id, teamColor } =
    data?.data;

  console.log("OtherTeam data", data.data);
  console.log("LeaderId", leaderId);
  return (
    <div className="p-4">
      <div className="flex flex-col flex-1 w-full mt-4">
        <div className="flex mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white absolute w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-gray-400/30 transition-colors"
          >
            <ArrowBack />
          </button>
          <p className="text-[20px] font-bold font-mono text-white text-center self-center w-full">
            Team - {teamNumber?.toString().padStart(3, "0")}{" "}
            {teamColor ? `- ${teamColor}` : null}{" "}
            {teamName ? `- ${teamName}` : null}
          </p>
        </div>
        {players?.map((member: any) => (
          <TeamMemberCard
            key={member.id}
            profileImage={member.profileImage}
            playerName={member.firstName + " " + member.lastName}
            isCaptain={member.id === leaderId}
            isMe={member._id === _id}
          />
        ))}
      </div>
    </div>
  );
};

export default OtherTeam;
