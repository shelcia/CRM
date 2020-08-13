export const LoadService = (result) => {
  return {
    type: `LOAD_SERVICE_REQUEST`,
    result: result,
  };
};

export const LoadContact = (result) => {
  return {
    type: `LOAD_CONTACT`,
    result: result,
  };
};
