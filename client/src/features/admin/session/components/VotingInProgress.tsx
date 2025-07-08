import VotingTimer from "../../../session/components/VotingTimer";

const VotingInProgress = () => {
  return (
    <div className="flex w-120 gap-4 items-center">
      <p>Voting In Progress: </p>
      <div className="flex-1 p-2 rounded-lg border border-black">
        <VotingTimer onTimerCompleted={() => {}} />
      </div>
    </div>
  );
};

export default VotingInProgress;
