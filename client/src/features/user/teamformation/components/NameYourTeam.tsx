import { useState } from "react";
import { useAssignTeamNameMutation } from "../../player/playerApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { Navigate } from "react-router-dom";

const NameYourTeam = () => {
  const [teamName, setTeamName] = useState("");
  const { sessionId } = useSelector((state: RootState) => state.session);
  const {teamName:stateTeamName}=useSelector((state:RootState)=>state.player);
  const [assignTeamName, { isLoading }] =
    useAssignTeamNameMutation();

  const handleSubmit = () => {
    if (teamName.trim() === "") {
      alert("Please enter a team name.");
      return;
    }
    assignTeamName({ teamName });
  };

  if(![null,""].includes(stateTeamName)) {
    return <Navigate to={`/user/${sessionId}/my-team`}/>
  }
  return (
    <div
      className="flex flex-col items-center justify-between py-10 px-4"
      style={{ minHeight: `${window.innerHeight}px` }}
    >
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-[24px] font-mono text-white text-center">
          Name your Team
        </h1>
        <p className="text-white text-[12px] text-center tracking-wider font-mono">
          As the captain, you get to choose your team's name!
        </p>
        <input
          placeholder="Enter your Team Name"
          className="bg-[#D8FEFF] mt-4 text-[12px] h-[40px] rounded-[4px] pl-3 font-mono outline-none focus:ring-2 focus:ring-blue-500"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading || !teamName.trim()}
        className={`bg-[#1E89E0] ${
          isLoading || !teamName.trim() ? "bg-gray-300" : null
        } text-white w-[100%] h-[40px] rounded-[12px]`}
      >
        Continue
      </button>
    </div>
  );
};

export default NameYourTeam;
