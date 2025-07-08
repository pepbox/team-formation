import Page from "../../../components/layout/Page";
import MeetTheTeamsComponent from "../../../features/admin/meetTheTeam/components/MeetTheTeam";

const MeetTheTeams = () => {
  // const { teams, isLoading, error } = useTeamsData();

  // if (isLoading) return <div>Loading teams...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <Page>
      <MeetTheTeamsComponent />
    </Page>
  );
};

export default MeetTheTeams;
