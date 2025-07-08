import CustomTable from "../../../../components/utility/table/CustomTable";

interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  teamInfo: {
    teamNumber:number;
    teamName: string;
  };
  votedLeader: string;
}
interface PlayersDataProps {
  data: Player[];
}
const PlayersData: React.FC<PlayersDataProps> = ({ data }) => {
  const playerData = data?.map((player) => ({
    ...player,
    name: `${player.firstName} ${player.lastName}`,
    votes: data.filter((p)=>p.votedLeader === player._id).length,
  }));

  console.log("Player Data:", playerData);
  // const EditButton = ({
  //   row,
  //   handler,
  // }: {
  //   row: any;
  //   handler: (...args: any[]) => void;
  // }) => {
  //   return (
  //     <button
  //       onClick={() => handler(row)}
  //       className="hover:bg-gray-200/50 rounded-full p-2"
  //     >
  //       <Pencil size={14} />
  //     </button>
  //   );
  // };

  const columns = [
    {
      header: "Player Name",
      key: "name",
      type: "simple",
    },
    {
      header: "Team Id",
      key: "teamInfo.teamNumber",
      type: "simple",
    },
    {
      header: "Team Name",
      key: "teamInfo.teamName",
      type: "simple",
    },
    {
      header:"Votes",
      key:"votes",
      type:"simple"
    }
    // {
    //   header: "Captain",
    //   key: "captain",
    //   type: "simple",
    // },
    // {
    //   header: "Team name",
    //   key: "teamName",
    //   type: "simple",
    // },
    // {
    //   header: "Change Name",
    //   key: "changeName",
    //   type: "action",
    //   component: EditButton,
    //   handler: (row: any) => {
    //     alert(`Edit team: ${row.teamName} (ID: ${row.id})`);
    //   },
    // },
  ];

  if (!data) {
    return null;
  }
  return (
    <div className="px-20">
      <h1 className="mx-5 my-3"><b>Total Players :</b> {playerData.length}</h1>
      <CustomTable columns={columns} data={playerData} keyField="id" />
    </div>
  );
};

export default PlayersData;
