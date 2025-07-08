import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useFetchAllTeamsQuery } from "../../player/playerApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

const AllTeamsList = () => {
  const { data, isLoading } = useFetchAllTeamsQuery(undefined);
  const { sessionId } = useSelector((state: RootState) => state.session);
  const navigate = useNavigate();
  if (isLoading) {
    return <p>Loading</p>;
  }
  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white absolute w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-gray-400/30 transition-colors"
          >
            <ArrowBack />
          </button>
          <p className="text-[20px] font-bold font-mono text-white text-center flex-1 ">
            All Teams
          </p>
        </div>

        {data.data.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => navigate(`/user/${sessionId}/team/${item._id}`)}
            className="w-[100%] h-[64px] bg-[#6B6694CC]/80 rounded-[12px] backdrop-blur-[2px] flex justify-between items-center mt-3 p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-[48px] h-[48px] rounded-full bg-[#EBFF7C] overflow-hidden"></div>
              <p className="font-bold text-[14px] font-mono">
                Team - {item.teamNumber} - {item.teamName}
              </p>
            </div>
            <ArrowForward />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTeamsList;
