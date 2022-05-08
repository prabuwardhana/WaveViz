export const fileContentReducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_CONTENT":
      return {
        ...state,
        content: payload,
      };
    case "RESET":
      return "";
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const secondAxisReducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_KEYS":
      return {
        ...state,
        keys: payload,
      };
    case "SET_SECOND_AXIS":
      return {
        ...state,
        showSecondAxis: payload,
      };
    case "UPDATE_CHECKED_STATE":
      return {
        ...state,
        checkedState: payload,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const axisSettingsReducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_AXIS":
      return {
        dateFormat: payload.dateFormat,
        yMin: payload.yMin,
        yMax: payload.yMax,
        yLabel: payload.yLabel,
        xLabel: payload.xLabel,
        y1Min: payload.y1Min,
        y1Max: payload.y1Max,
        secondAxisLabel: payload.secondAxisLabel,
      };
    case "UPDATE_FIELD":
      return {
        ...state,
        [payload.key]: payload.value,
      };
    case "RESET":
      return "";
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};
