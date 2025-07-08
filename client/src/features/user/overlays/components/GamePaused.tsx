const GamePaused = () => {
  return (
    <div className="inset-0 w-full h-full z-50 flex justify-center items-center">
      <div className="text-white flex flex-col justify-between text-center space-y-2">
        <h1 className="text-[24px] font-bold leading-[24px] font-mono">
          The Game is Paused
        </h1>
        <h2 className="text-[16px] leading-[20px] font-mono">
          Take a breath.
          <br />
          The game will resume soon.
        </h2>
      </div>
    </div>
  );
};

export default GamePaused;
