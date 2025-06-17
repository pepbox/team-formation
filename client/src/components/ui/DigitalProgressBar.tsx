import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import Row from "../utility/Row";

interface DigitalProgressBarProps {
  percentage: number;
  color: string;
  bgColor?: string;
  height?: string;
  width?: string;
  minBarWidth?: number;
  gap?: number;
  animationDuration?: number;
  animationDelay?: number;
}

const DigitalProgressBar: React.FC<DigitalProgressBarProps> = ({
  bgColor = "#fff",
  color,
  percentage,
  height = "48px",
  width = "100%",
  minBarWidth = 8,
  gap = 5,
  animationDuration = 0.8,
  animationDelay = 0.5,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, animationDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, percentage, animationDelay]);

  const calculateBars = (
    containerWidth: number
  ): { totalBars: number; barWidth: number } => {
    const availableWidth = containerWidth - gap;
    const totalGapWidth =
      gap * Math.floor(availableWidth / (minBarWidth + gap));
    const widthForBars = containerWidth - totalGapWidth;

    const totalBars = Math.floor(widthForBars / minBarWidth);

    const barWidth =
      totalBars > 0
        ? (containerWidth - (totalBars - 1) * gap) / totalBars
        : minBarWidth;

    return { totalBars: Math.max(1, totalBars), barWidth };
  };

  const defaultWidth = 400;
  const { totalBars, barWidth } = calculateBars(defaultWidth);

  const filledBars = Math.round((animatedPercentage / 100) * totalBars);

  return (
    <Box ref={ref}>
      <Row
        sx={{
          width: width,
          height: height,
          display: "flex",
          alignItems: "center",
          gap: `${gap}px`,
          padding: "4px",
        }}
      >
        {Array.from({ length: totalBars }, (_, index) => {
          const shouldFill = index < filledBars;
          const animationDelayForBar = (index / totalBars) * animationDuration;

          return (
            <motion.div
              key={index}
              initial={{ backgroundColor: bgColor }}
              animate={{
                backgroundColor: shouldFill ? color : bgColor,
              }}
              transition={{
                duration: 0.05,
                delay: isInView ? animationDelayForBar + animationDelay : 0,
                ease: "easeOut",
              }}
              style={{
                width: `${barWidth}px`,
                height: "100%",
                borderRadius: "1px",
              }}
            />
          );
        })}
      </Row>
    </Box>
  );
};

export default DigitalProgressBar;
