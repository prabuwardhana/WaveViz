import React, { createContext, useReducer } from "react";
import { fileContentReducer } from "./Reducer";

const dataInitialState = {
  content: "",
};

export const FileContentContext = createContext(dataInitialState);

export const FileContentStore = ({ children }) => {
  const [state, dispatch] = useReducer(fileContentReducer, dataInitialState);

  return (
    <FileContentContext.Provider value={[state, dispatch]}>
      {children}
    </FileContentContext.Provider>
  );
};
