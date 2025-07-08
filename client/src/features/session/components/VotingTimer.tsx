import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useState, useEffect } from "react";

const VotingTimer = ({
  onTimerCompleted,
}: {
  onTimerCompleted: () => void;
}) => {
  const { votingStartTime, votingDuration } = useSelector(
    (state: RootState) => state.session
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!votingStartTime || !votingDuration) {
      return;
    }

    let interval: NodeJS.Timeout;

    const updateTimer = () => {
      const currentTime = new Date();
      const endTime = votingStartTime.getTime() + votingDuration * 1000;
      const remaining = endTime - currentTime.getTime();

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        onTimerCompleted();
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimer();
    interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [votingStartTime, votingDuration]);

  if (!votingStartTime || !votingDuration) {
    return null;
  }

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = Math.max(
    0,
    (timeLeft / (votingDuration * 1000)) * 100
  );

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 rounded-3xl flex-1 overflow-hidden border-2 border-white">
        <div
          className="h-full bg-[#1E89E0] transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="min-w-[50px]">{formatTime(timeLeft)}</p>
    </div>
  );
};

export default VotingTimer;
