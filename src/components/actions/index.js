export const LoadService = (result) => {
  return {
    type: `LOAD_SERVICE_REQUEST`,
    result: result,
  };
};

export const DelService = (id) => {
  return {
    type: `DEL_SERVICE_REQUEST`,
    id: id,
  };
};

export const LoadLead = (result) => {
  return {
    type: `LOAD_LEAD`,
    result: result,
  };
};

export const DelLead = (id) => {
  return {
    type: `DEL_LEAD`,
    id: id,
  };
};

export const LoadContact = (result) => {
  return {
    type: `LOAD_CONTACT`,
    result: result,
  };
};

export const DelContact = (id) => {
  return {
    type: `DEL_CONTACT`,
    id: id,
  };
};
