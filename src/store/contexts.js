import React, { createContext, useReducer } from "react";
import { fileContentReducer } from "./reducers";
import { axisSettingsReducer, secondAxisReducer } from "./reducers";

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

const axisSettingsInitialState = {
  dateFormat: "%Y%m%d",
  yMin: "0",
  yMax: "10",
  yLabel: "Y Axis",
  xLabel: "X Axis",
  y1Min: "0",
  y1Max: "10",
  secondAxisLabel: "Secondary Axis Label",
};

export const AxisSettingsContext = createContext(axisSettingsInitialState);

export const AxisSettingsStore = ({ children }) => {
  const [state, dispatch] = useReducer(
    axisSettingsReducer,
    axisSettingsInitialState
  );

  return (
    <AxisSettingsContext.Provider value={[state, dispatch]}>
      {children}
    </AxisSettingsContext.Provider>
  );
};
