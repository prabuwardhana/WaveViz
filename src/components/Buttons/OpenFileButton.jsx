import { FolderOpen } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useContext } from "react";
import { FileContentContext } from "../../store/contexts";

const OpenFileButton = () => {
  const [, dispatch] = useContext(FileContentContext);

  const handleClick = async () => {
    // Calling loadFile() will invoke the load-file event and return a promise.
    // Once main process sent a respond, the promise is resolved.
    const content = await window.electronApi.loadFile();

    // As soon as we have received a respond from main process,
    // store the respond (file content) into global state.
    // The file content will be used by the other components.
    content &&
      dispatch({
        type: "SET_CONTENT",
        payload: content,
      });
  };

  return (
    <Button
      variant="contained"
      startIcon={<FolderOpen />}
      onClick={handleClick}
    >
      Open CSV
    </Button>
  );
};

export default OpenFileButton;
