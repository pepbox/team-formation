import { Box, SxProps } from "@mui/material";
import idfcLogo from "../../assets/images/logos/IDFC-logo.webp";

const IdfcLogo = ({sx}:{sx?:SxProps}) => {
  return (
    <Box component={"img"} src={idfcLogo} width={"24px"} height={"24px"} sx={{...sx}}/>
  );
};

export default IdfcLogo;
