import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { SessionStates } from "../../../session/types/sessionStates";
import { useContinueToGameMutation } from "../../player/playerApi";

const ContinueToGameButton = () => {
  const { state, gameLinked } = useSelector(
    (state: RootState) => state.session
  );
  const [continueToGame, { isLoading }] = useContinueToGameMutation();
  if (state != SessionStates.COMPLETED || !gameLinked) {
    return null;
  }

  const handleContinueToGame = async () => {
    if (isLoading) return;
    try {
      const response = await continueToGame(undefined).unwrap();
      console.log("Continue to game response:", response.data);
      if (response.data?.gameUrl) {
        window.location.href = response.data.gameUrl;
      }
    } catch (error) {
      console.error("Error continuing to game:", error);
    }
  };
  return (
    <button
      disabled={isLoading}
      onClick={handleContinueToGame}
      className={`flex-1 bg-white ${
        isLoading ? "bg-gray-400" : null
      } py-2 cursor-pointer text-black h-[40px] rounded-[12px] text-center font-mono`}
    >
      Continue to Game
    </button>
  );
};

export default ContinueToGameButton;
