import { Box, useTheme } from "@mui/material";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

// Sample data - you can replace this with your actual data
const data = [
  { X: "A", your: 0, mira: 0 },
  { X: "B", your: 70000, mira: 40000 },
  { X: "C", your: 100000, mira: 60000 },
  { X: "D", your: 110000, mira: 60000 },
  { X: "E", your: 110000, mira: 55000 },
  { X: "F", your: 105000, mira: 52000 },
  { X: "G", your: 110000, mira: 51000 },
  { X: "H", your: 120000, mira: 60000 },
  { X: "I", your: 130000, mira: 70000 },
  { X: "J", your: 135000, mira: 80000 },
  { X: "K", your: 137000, mira: 80000 },
  { X: "L", your: 120000, mira: 80000 },
  { X: "M", your: 120000, mira: 80000 },
  { X: "N", your: 130000, mira: 90000 },
];

const CustomLineChart = () => {
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  // Custom dot renderer that only shows a dot for the last point in the dataset
  const renderLastDot = (props: any, color: string) => {
    const { cx, cy, index, dataKey } = props;
    // Only render dot if it's the last item in the dataset
    if (index === data.length - 1) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill={color}
          key={`dot-${dataKey}-${index}`}
        />
      );
    }
    return <></>;
  };

  return (
    <Box
      ref={ref}
      sx={{
        width: "100%",
        height: 200,
        marginY: 3,
        "& .recharts-cartesian-grid-vertical": {
          stroke: "#333",
          strokeDasharray: "2 2",
        },
        "& .recharts-cartesian-grid-horizontal": {
          stroke: "#333",
          strokeDasharray: "2 2",
        },
      }}
    >
      {isInView && (
        <ResponsiveContainer
          width="130%"
          height="100%"
          style={{ transform: "translateX(-20%)" }}
        >
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <XAxis dataKey="X" axisLine={false} tickLine={false} tick={false} />
            <YAxis axisLine={false} tickLine={false} tick={false} />{" "}
            <Line
              type="monotone"
              dataKey="your"
              stroke="#fff"
              strokeWidth={3}
              dot={(props) => renderLastDot(props, "#fff")}
              activeDot={{ r: 5, fill: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="mira"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={(props) => renderLastDot(props, theme.palette.primary.main)}
              activeDot={{ r: 5, fill: theme.palette.primary.main }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default CustomLineChart;
