import { getRTKErrorMessage } from "../../../../utility/getRTKErrorMessage";
import { useAdminContinueToGameMutation } from "../adminSessionApi";

const ContinueToGame = () => {
  const [continueToGame, { isLoading, error }] =
    useAdminContinueToGameMutation();

  const handleContinueToGame = async () => {
    const response = await continueToGame(undefined).unwrap();
    try {
      if (response.data?.adminLink) {
        window.location.href = response.data.adminLink;
      }
    } catch (error) {
      console.error("Error continuing to game:", error);
      alert("Failed to coFntinue to the game. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-end w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-2">
      <button
      onClick={handleContinueToGame}
      disabled={isLoading}
      className="bg-[#111111] w-full sm:w-max text-white px-4 py-2 cursor-pointer rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
      {isLoading ? "Starting..." : "Continue to Game"}
      </button>
      {error && (
      <div className="text-red-500 mt-2 text-sm break-words">{getRTKErrorMessage(error)}</div>
      )}
    </div>
  );
};

export default ContinueToGame;
