import { Box, SxProps } from "@mui/material";
import React from "react";
import messageTriangleLeft from "../../assets/images/message-triangle-left.webp";
import messageTriangleRight from "../../assets/images/message-triangle-right.webp";

interface MessageBoxProps {
  messageContent: React.ReactNode;
  mode?: "VERTICAL" | "HORIZONTAL";
  position: "LEFT" | "RIGHT";
  sx?: SxProps;
}
const MessageBox: React.FC<MessageBoxProps> = ({
  messageContent,
  position = "LEFT",
  mode = "VERTICAL",
  sx,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "2px solid #000",
        padding: "16px",
        position: "relative",
        ...sx,
      }}
    >
      {messageContent}
      {/* <motion.div variants={messageContentVariants}>
                {messageContent}
              </motion.div> */}

      <Box
        component={"img"}
        position={"absolute"}
        src={position === "LEFT" ? messageTriangleLeft : messageTriangleRight}
        sx={{
          bottom: mode === "VERTICAL" ? 0 : "20px",
          width: "24px",
          right:
            mode === "VERTICAL"
              ? (position === "LEFT"
                ? "24px"
                : "unset")
              : (position === "RIGHT"
              ? "0"
              : "unset"),
          left:
            mode === "VERTICAL"
              ? (position === "LEFT"
                ? "unset"
                : "24px")
              : (position === "RIGHT"
              ? "unset"
              : "0"),
          transform:mode === "VERTICAL"
              ? (position === "LEFT"
                ? "translateY(100%)"
                : "translateY(100%)")
              : (position === "RIGHT"
              ? "translateX(calc(100% + 2px)) rotate(-90deg)"
              : "translateX(calc(-100% - 2px)) rotate(90deg)"),


          // right:
          //   position === "LEFT" && mode === "VERTICAL"
          //     ? "24px"
          //     : position === "LEFT"
          //     ? "0"
          //     : "unset",
          // left:
          //   position === "RIGHT" && mode === "VERTICAL"
          //     ? "24px"
          //     : position === "RIGHT"
          //     ? "0"
          //     : "unset",
          // transform: `translateY(calc(100% - 1px)) ${
          //   mode === "HORIZONTAL"
          //     ? position === "LEFT"
          //       ? "rotate(90deg)"
          //       : "rotate(-90deg)"
          //     : ""
          // }`,
        }}
      />
    </Box>
  );
};

export default MessageBox;
