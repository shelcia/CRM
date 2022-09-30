// response.js

// import toast from "react-hot-toast";

// This is kept separate to keep our files lean and allow a clean separation
// for any response and error logic you may want to handle here for all API calls.
// Maybe you want to log an error here or create custom actions for authorization based
// on the response header.

export function handleResponse(response) {
  if (response.results) {
    return response.results;
  }

  if (response.data) {
    return response.data;
  }

  if (response.message) {
    return response.message;
  }

  return response;
}

export function handleError(error) {
  if (error.data) {
    // toast.error(error.data);
    return error.data;
  }
  if (error.message) {
    // toast.error(error.message);
    return error.message;
  }
  // toast.error(error);
  return error;
}
