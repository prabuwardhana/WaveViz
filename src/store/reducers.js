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
