import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, SxProps, useTheme } from "@mui/material";

interface FullwidthButtonProps {
  icon?: "NEXT" | "PREV";
  value?: string;
  sx?: SxProps;
  disabled?:boolean;
  handleOnClick: () => void;
}

const FullwidthButton: React.FC<FullwidthButtonProps> = ({
  icon,
  value,
  disabled = false,
  handleOnClick,
  sx
}) => {
  const theme=useTheme();
  return (
    <Button
      variant="contained"
      disabled={disabled}
      endIcon={icon == "NEXT" && <ArrowForward />}
      startIcon={icon == "PREV" && <ArrowBack />}
      onClick={handleOnClick}
      sx={{
        padding: "12px",
        bgcolor: theme.palette.primary.main,
        color: "#fff",
        borderRadius: "0",
        width: "100%",
        textTransform:"none",
        justifyContent:"space-between",
        ...sx,
      }}
    >
      {value}
    </Button>
  );
};

export default FullwidthButton;
