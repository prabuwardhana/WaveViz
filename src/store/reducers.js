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
