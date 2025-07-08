import { useState } from "react";
import { useDispatch } from "react-redux";
import Base from "../../../../assets/images/teamSpinner/base.webp";
import UpToggle from "../../../../assets/images/teamSpinner/UpToggle.webp";
import DownToggle from "../../../../assets/images/teamSpinner/DownToggle.webp";
import { useLazyFetchMyTeamQuery } from "../../player/playerApi";
import { setTeam } from "../../player/playerSlice";
import { AppDispatch, RootState } from "../../../../app/store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function TeamRandomizer() {


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [togglePosition, setTogglePosition] = useState("up");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [displayNumbers, setDisplayNumbers] = useState([0, 0, 0]);
  const [fetchMyTeam] = useLazyFetchMyTeamQuery();

  const fetchRandomNumber = async () => {
    const apiCallPromise = fetchMyTeam({});

    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const [apiResult] = await Promise.all([apiCallPromise, minDelayPromise]);

      console.log("API Result:", apiResult);

      if (apiResult.data) {
        dispatch(
          setTeam({
            teamName: apiResult.data.data.teamInfo.teamName,
            teamNumber: apiResult.data.data.teamInfo.teamNumber,
            teamMembers: apiResult.data.data.teamPlayers,
          })
        );

        const teamNum = apiResult.data.data.teamInfo.teamNumber;
        let digits;

        if (teamNum && !isNaN(Number(teamNum))) {
          digits = Number(teamNum)
            .toString()
            .padStart(3, "0")
            .split("")
            .map(Number);
        } else {
          const randomNum = Math.floor(Math.random() * 1000);
          digits = randomNum.toString().padStart(3, "0").split("").map(Number);
        }

        return digits;
      } else {
        throw new Error("No team data received");
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      // Fallback to random number on error
      const randomNum = Math.floor(Math.random() * 1000);
      const digits = randomNum
        .toString()
        .padStart(3, "0")
        .split("")
        .map(Number);
      return digits;
    }
  };

  const startCountdown = () => {
    setIsRedirecting(true);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate(`/user/${sessionId}/my-team`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Animation for spinning numbers
  const animateNumbers = async () => {
    setIsSpinning(true);

    // Fast spinning animation for 3 seconds
    const spinInterval = setInterval(() => {
      setDisplayNumbers([
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]);
    }, 100);

    const result = await fetchRandomNumber();

    setTimeout(() => {
      clearInterval(spinInterval);
      setDisplayNumbers(result);
      setIsSpinning(false);
      setTimeout(() => {
        startCountdown();
      }, 1000);
    }, 3000);
  };

  const handleToggle = () => {
    if (isAnimating || hasSpun) return;

    setIsAnimating(true);
    setHasSpun(true);
    setTogglePosition("down");

    // Start number animation when lever is pulled
    setTimeout(() => {
      animateNumbers();
    }, 200);

    setTimeout(() => {
      setTogglePosition("up");
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 500);
  };

  return (
    <div
      className="relative flex items-center justify-center "
      style={{ minHeight: `${window.innerHeight}px` }}
    >
      <div
        className="flex flex-col items-center justify-between py-10 mx-6"
        style={{ minHeight: `${window.innerHeight}px` }}
      >
        <div>
          <div>
            <p className="text-xl font-bold text-white font-mono text-center">
              Team Selection
            </p>
          </div>
          <div>
            <p className="text-white text-base font-mono text-center mt-3">
              Pull the lever to find out which team you'll join!
            </p>
          </div>
        </div>

        <div className="relative w-64 h-64 mt-4" style={{ scale: "1.1" }}>
          {/* Base image */}
          <img
            className="absolute top-0 left-0 w-full z-30"
            src={Base}
            alt="Selection wheel base"
          />

          {/* Numbers display overlay on the base image */}
          <div className="absolute inset-0 flex w-full  items-center justify-center">
            <div className="flex flex-1 ml-[32px] mr-[45px] mt-[-14px]">
              {displayNumbers.map((num, index) => (
                <div
                  key={index}
                  className={`flex-1  h-[90px] bg-white text-black text-3xl font-bold flex items-center justify-center rounded ${
                    isSpinning ? "animate-pulse" : ""
                  }`}
                >
                  <span
                    className={
                      isSpinning
                        ? "transition-all duration-100"
                        : "transition-all duration-300"
                    }
                    style={{ filter: isSpinning ? "blur(4px)" : "none" }}
                  >
                    {num}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle images with animation */}
          <div className="absolute top-0 left-0 w-full">
            <img
              className={`absolute top-0 left-0 w-full transition-opacity duration-300 ease-in-out ${
                togglePosition === "up" ? "opacity-100" : "opacity-0"
              }`}
              src={UpToggle}
              alt="Up toggle"
            />

            <img
              className={`absolute top-0 left-0 w-full transition-opacity duration-300 ease-in-out ${
                togglePosition === "down" ? "opacity-100" : "opacity-0"
              }`}
              src={DownToggle}
              alt="Down toggle"
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className="text-center mt-4">
          {isSpinning ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <span className="text-red-400 font-bold font-mono text-sm">
                SPINNING...
              </span>
              <div
                className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
            </div>
          ) : isRedirecting ? (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-green-400 font-bold font-mono text-sm">
                SPIN COMPLETE!
              </span>
              <span className="text-blue-400 font-bold font-mono text-xs">
                Redirecting to your team in {countdown}...
              </span>
            </div>
          ) : hasSpun ? (
            <span className="text-green-400 font-bold font-mono text-sm">
              SPIN COMPLETE!
            </span>
          ) : (
            <span className="text-gray-400 font-bold font-mono text-sm">
              READY TO SPIN
            </span>
          )}
        </div>

        <button
          className={`w-full h-[40px] font-mono text-[12px] text-white rounded-[12px] mt-4 transition-all duration-300 ${
            hasSpun
              ? "bg-gray-500 cursor-not-allowed"
              : isAnimating
              ? "bg-orange-500"
              : "bg-[#1E89E0] hover:bg-[#1a7bc8]"
          }`}
          onClick={handleToggle}
          disabled={isAnimating || hasSpun}
        >
          {isSpinning
            ? "SPINNING..."
            : hasSpun
            ? "SPIN COMPLETE"
            : "Pull the Lever"}
        </button>
      </div>
    </div>
  );
}

export default TeamRandomizer;
