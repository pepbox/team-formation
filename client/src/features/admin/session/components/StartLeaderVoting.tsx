import { useState } from "react";
import { useStartLeaderVotingMutation } from "../adminSessionApi";
import { getRTKErrorMessage } from "../../../../utility/getRTKErrorMessage";

const StartLeaderVoting = () => {
  const [startLeaderVoting, { isLoading, error }] =
    useStartLeaderVotingMutation();
  const [votingDuration, setVotingDuration] = useState<number>(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const handleStartLeaderVoting = () => {
    setShowConfirmDialog(true);
  };

  const confirmStartLeaderVoting = () => {
    startLeaderVoting({ votingDuration });
    setShowConfirmDialog(false);
  };

  const cancelStartLeaderVoting = () => {
    setShowConfirmDialog(false);
  };

  const handleChangeVotingDuration = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setVotingDuration(0);
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        setVotingDuration(parsedValue);
      } else {
        setVotingDuration(0);
      }
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter duration (seconds)"
          value={votingDuration > 0 ? votingDuration : ""}
          onChange={handleChangeVotingDuration}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleStartLeaderVoting}
          disabled={isLoading || votingDuration <= 0}
          className="bg-[#111111] text-white px-4 py-2 cursor-pointer rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Starting..." : "Start Leader Voting"}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-red-500">{getRTKErrorMessage(error)}</div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Leader Voting
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to start leader voting with a duration of{" "}
              {votingDuration} seconds?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelStartLeaderVoting}
                className="px-4 py-2 text-gray-600 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartLeaderVoting}
                disabled={isLoading}
                className="px-4 py-2 bg-[#111111] cursor-pointer text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Starting..." : "Yes, Start"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartLeaderVoting;
