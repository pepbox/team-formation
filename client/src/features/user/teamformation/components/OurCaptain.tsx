import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { Avatar } from "@mui/material";
import ThreeStars from "../../../../assets/images/three-stars.webp";
import BottomElement from "../../../../components/ui/BottomElement";
import { useNavigate } from "react-router-dom";

const OurCaptain = () => {
  const { teamLeaderId, teamMembers } = useSelector(
    (state: RootState) => state.player
  );
  const {sessionId} = useSelector((state: RootState) => state.session);
  const navigate = useNavigate();

  const leader = teamMembers?.find((member) => member._id === teamLeaderId);

  if (!leader) {
    return (
      <div>
        <p className="text-white">Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="mt-12">
        <h1 className="font-bold text-[24px] text-white font-mono text-center">
          Captain of the
          <br /> team is
        </h1>
      </div>
      <div className="relative mt-12 flex flex-col w-[100%] gap-6">
        <div className="relative w-[112px] h-[112px] rounded-full bg-white overflow-hidden self-center">
          {leader.profileImage ? (
            <img
              src={leader?.profileImage}
              className="w-[112px] h-[112px] object-cover"
            />
          ) : (
            <Avatar />
          )}
        </div>
        <img
          src={ThreeStars}
          className="absolute bottom-0 translate-y-4 left-1/2w-[92px] h-[52px] self-center"
        />
      </div>
      <p className="text-center mt-8 font-bold text-[20px] font-mono text-white">
        {leader?.firstName} {leader?.lastName}
      </p>
      <BottomElement>
        <button
          className="bg-[#1E89E0] text-white w-[100%] h-[40px] rounded-[12px] "
          onClick={() => navigate(`/user/${sessionId}/my-team`)}
        >
          Continue
        </button>
      </BottomElement>
    </div>
  );
};

export default OurCaptain;
