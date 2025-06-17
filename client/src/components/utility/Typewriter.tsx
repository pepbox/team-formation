import TypewriterComponent from "typewriter-effect";

interface TypewriterProps {
  strings: string[];
  index: number;
  completionStates: boolean[];
  speed?:number;
  onComplete: (index: number) => void;
  lineHeight?: string;
  sx?: React.CSSProperties;
}

const CustomTypewriter: React.FC<TypewriterProps> = ({ 
  strings, 
  index, 
  completionStates, 
  speed=50,
  onComplete ,
  sx = {},
  lineHeight = "unset"
}) => {
  
  const shouldStart = index === 0 || completionStates[index - 1];
  const isLastElement = index === completionStates.length - 1;
  const shouldHideCursor = !isLastElement && completionStates[index];
  
  if (!shouldStart) {
    return <span></span>;
  }

  const combinedString = strings.join(' ');

  return (
    <div className={shouldHideCursor ? 'hide-typewriter-cursor' : ''} style={{lineHeight:lineHeight, ...sx}}>
      <TypewriterComponent
        onInit={(typewriter) => {
          typewriter
            .changeDelay(speed) 
            .typeString(combinedString)
            .callFunction(() => {
              onComplete(index);
            })
            .start();
        }}
      />
      <style>{`
        .hide-typewriter-cursor .Typewriter__cursor {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default CustomTypewriter;