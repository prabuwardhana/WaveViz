import { Settings } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const TriggerButton = React.forwardRef(({ triggerText, handleClick }, ref) => (
  <Button
    ref={ref}
    variant="contained"
    startIcon={<Settings />}
    onClick={handleClick}
  >
    {triggerText}
  </Button>
));

export default TriggerButton;
