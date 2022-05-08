import React, { createContext, useReducer } from "react";
import { fileContentReducer } from "./Reducer";
import { secondAxisReducer } from "./reducers";

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

const secondAxisInitialState = {
  keys: [],
  showSecondAxis: false,
  checkedState: [],
};

export const SecondAxisContext = createContext(secondAxisInitialState);

export const DataHeaderStore = ({ children }) => {
  const [state, dispatch] = useReducer(
    secondAxisReducer,
    secondAxisInitialState
  );

  return (
    <SecondAxisContext.Provider value={[state, dispatch]}>
      {children}
    </SecondAxisContext.Provider>
  );
};
