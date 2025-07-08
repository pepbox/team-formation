import { useState } from "react";
import { useStartTeamFormationMutation } from "../adminSessionApi";
import { getRTKErrorMessage } from "../../../../utility/getRTKErrorMessage";

const StartTeamFormation = () => {
  const [startTeamFormation, { isLoading, error }] =
    useStartTeamFormationMutation();
  const [numberOfTeams, setNumberOfTeams] = useState<number>(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const handleStartTeamFormation = () => {
    setShowConfirmDialog(true);
  };

  const confirmStartTeamFormation = () => {
    startTeamFormation({ numberOfTeams });
    setShowConfirmDialog(false);
  };

  const cancelStartTeamFormation = () => {
    setShowConfirmDialog(false);
  };

  const handleChangeNumberOfTeams = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setNumberOfTeams(0);
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        setNumberOfTeams(parsedValue);
      } else {
        setNumberOfTeams(0);
      }
    }
  };
  return (
    <div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter no. of teams"
          value={numberOfTeams > 0 ? numberOfTeams : ""}
          onChange={handleChangeNumberOfTeams}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleStartTeamFormation}
          disabled={isLoading || numberOfTeams <= 0}
          className="bg-[#111111] text-white px-4 py-2 cursor-pointer rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Starting..." : "Start Team Formation"}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-red-500">{getRTKErrorMessage(error)}</div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Team Formation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to start team formation with {numberOfTeams}{" "}
              teams?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelStartTeamFormation}
                className="px-4 py-2 text-gray-600 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartTeamFormation}
                disabled={isLoading}
                className="px-4 py-2 bg-[#111111] text-white cursor-pointer rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

export default StartTeamFormation;
