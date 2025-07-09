import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Wheel } from "react-custom-roulette";
import { RootState } from "../../../../app/store";

interface Winner {
  id: string;
  name: string;
}
interface MultipleWinnersSpinProps {
  winners?: Winner[];
  chosenWinner?: string;
}
const MultipleWinnersSpin: React.FC<MultipleWinnersSpinProps> = ({
  winners = [],
  chosenWinner,
}) => {
  const navigate = useNavigate();
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // Generate multiple colors for the wheel segments
  const segmentColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8C471", "#82E0AA", "#F1948A", "#AED6F1", "#D2B4DE"
  ];

  // Prepare data for the wheel
  const data = winners.map((winner, index) => ({
    option: winner.name,
    style: { 
      backgroundColor: segmentColors[index % segmentColors.length],
      textColor: "#FFFFFF"
    }
  }));

  // Find the index of the chosen winner
  const chosenWinnerIndex = winners.findIndex(winner => winner.id === chosenWinner);

  useEffect(() => {
    if (winners.length > 0 && chosenWinner) {
      // Start spinning after a short delay
      setTimeout(() => {
        setPrizeNumber(chosenWinnerIndex >= 0 ? chosenWinnerIndex : 0);
        setMustSpin(true);
      }, 500);
    }
  }, [winners, chosenWinner, chosenWinnerIndex]);

  const handleSpinFinish = () => {
    setMustSpin(false);
    // Navigate to captain page after spin finishes
    setTimeout(() => {
      navigate(`/user/${sessionId}/our-captain`, { replace: true });
    }, 2000);
  };

  if (!winners.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-white text-2xl font-bold mb-4">
          Its a Tie 
        </h2>
        <div className="relative">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleSpinFinish}
            outerBorderColor="#333333"
            outerBorderWidth={8}
            innerBorderColor="#FFFFFF"
            innerBorderWidth={4}
            radiusLineColor="#333333"
            radiusLineWidth={2}
            fontSize={16}
            textDistance={60}
            spinDuration={0.8}
          />
        </div>
        <div className="text-white text-lg">
          {mustSpin ? "Spinning..." : "Captain Selected!"}
        </div>
      </div>
    </div>
  );
};

export default MultipleWinnersSpin;
