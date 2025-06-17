import { Box } from "@mui/material";
import Row from "../utility/Row";
import flagFilled from "../../assets/images/flag-filled.webp";
import flag from "../../assets/images/flag.webp";
import flagFilledDark from "../../assets/images/flag-filled-dark.webp";
import flagDark from "../../assets/images/flag-dark.webp";

const FlagsIndicator = ({
  flags,
  variant,
  flagSize = "18px",
}: {
  flags: number;
  variant: "dark" | "light";
  flagSize?: string;
}) => {
  const filledFlag = variant === "dark" ? flagFilledDark : flagFilled;
  const emptyFlag = variant === "dark" ? flagDark : flag;
  return (
    <Row>
      {Array.from({ length: 3 }, (_, index) => (
        <Box
          component={"img"}
          src={index < flags ? filledFlag : emptyFlag}
          style={{
            width: flagSize,
            opacity: variant === "light" ? (index < flags ? 1 : 0.5) : 1,
          }}
        />
      ))}
    </Row>
  );
};

export default FlagsIndicator;
