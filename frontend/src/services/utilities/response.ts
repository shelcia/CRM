// response.ts

// This is kept separate to keep our files lean and allow a clean separation
// for any response and error logic you may want to handle here for all API calls.
// Maybe you want to log an error here or create custom actions for authorization based
// on the response header.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleResponse(response: any): any {
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

export function handleError(error: unknown) {
  console.log(error);
  const axiosError = error as { response?: { data?: unknown } };
  if (axiosError?.response?.data) {
    return axiosError.response.data;
  }
  return error;
}
