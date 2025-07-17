import VotingTimer from "../../../session/components/VotingTimer";

const VotingInProgress = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-xl gap-2 sm:gap-4 items-center">
      <p className="whitespace-nowrap">Voting In Progress: </p>
      <div className="flex-1 w-full p-2 rounded-lg border border-black">
      <VotingTimer onTimerCompleted={() => {}} />
      </div>
    </div>
  );
};

export default VotingInProgress;
