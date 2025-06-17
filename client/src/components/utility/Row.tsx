import { Stack, SxProps } from "@mui/material"
import React from "react"

const Row = ({sx,children}:{sx?:SxProps,children:React.ReactNode}) => {
  return (
    <Stack direction={"row"} alignItems={"center"} sx={{...sx}}>
      {children}
    </Stack>
  )
}

export default Row
