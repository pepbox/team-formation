import { Box, Stack, SxProps } from "@mui/material";
import React from "react";

interface PictureCardProps {
  image: string;
  content: React.ReactNode;
  contentAlign?: "left" | "right";
  sx:SxProps;
  overlayOpacity?:number;
}
const PictureCard: React.FC<PictureCardProps> = ({ image, content ,overlayOpacity,sx}) => {
  return (
    <Stack
      border={"3px solid #fff"}
      padding={"16px"}
      sx={{
        background: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "center",
        position: "relative",
        ...sx,
      }}
    >
      <Box zIndex={2}>{content}</Box>
      <Box
        position={"absolute"}
        width={"100%"}
        height={"100%"}
        zIndex={1}
        bgcolor={"#000000"}
        top={0}
        left={0}
        sx={{opacity:overlayOpacity ? overlayOpacity : 0 }}
      />
    </Stack>
  );
};

export default PictureCard;
