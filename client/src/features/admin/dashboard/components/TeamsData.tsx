import { Pencil } from "lucide-react";
import CustomTable from "../../../../components/utility/table/CustomTable";
import { EnrichedTeam } from "../../../session/teamsPlayersSlice";
import EditTeamNamePopup from "./EditTeamNamePopup";
import { useState } from "react";

interface TeamsDataProps {
  data: EnrichedTeam[];
}
const TeamsData: React.FC<TeamsDataProps> = ({ data }) => {
  const [editTeamNameId, setEditTeamNameId] = useState<string | null>(null);
  const teamsData = data.map((team) => ({
    ...team,
    leaderName: team.leader
      ? `${team.leader.firstName} ${team.leader.lastName}`
      : "Not Assigned",
  }));

  console.log("Team Data:", teamsData);
  const EditButton = ({
    row,
    handler,
  }: {
    row: any;
    handler: (...args: any[]) => void;
  }) => {
    return (
      <button
        onClick={() => handler(row)}
        className="hover:bg-gray-200/50 rounded-full p-2"
      >
        <Pencil size={14} />
      </button>
    );
  };

  const columns = [
    {
      header: "Team Id",
      key: "teamNumber",
      type: "simple",
    },
    {
      header: "Players",
      key: "players.length",
      type: "simple",
    },
    {
      header: "Team Name",
      key: "teamName",
      type: "simple",
    },
    {
      header: "Captain",
      key: "leaderName",
      type: "simple",
    },
    // {
    //   header: "Team name",
    //   key: "teamName",
    //   type: "simple",
    // },
    {
      header: "Change Name",
      key: "changeName",
      type: "action",
      component: EditButton,
      handler: (row: any) => {
        console.log("Edit Button Clicked for row:", row);
        setEditTeamNameId(row.id);
      },
    },
  ];

  if (!data) {
    return null;
  }
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 w-full">
      <h1 className="mx-2 sm:mx-5 my-3 text-base sm:text-lg">
      <b>Total Teams :</b> {teamsData.length}
      </h1>

      <div className="overflow-x-auto">
      <CustomTable columns={columns} data={teamsData} keyField="id" />
      </div>
      <EditTeamNamePopup
      teamId={editTeamNameId || ""}
      isOpen={!!editTeamNameId}
      onClose={() => setEditTeamNameId(null)}
      />
    </div>
  );
};

export default TeamsData;
