import { Box } from "@mui/material";

interface SemiTopCardProps {
  topContent: React.ReactNode;
  topColor: string;
  bottomContent: React.ReactNode;
}
const SemiTopCard: React.FC<SemiTopCardProps> = ({
  topContent,
  topColor,
  bottomContent,
}) => {
  return (
    <Box padding="16px" bgcolor={"#fff"}>
      <Box
        sx={{
          bgcolor: topColor,
          clipPath:
            "ellipse(100% 100% at 50% 0%)",
        }}
      >
        {topContent}
      </Box>
      <Box marginTop={"12px"}>{bottomContent}</Box>
    </Box>
  );
};

export default SemiTopCard;
