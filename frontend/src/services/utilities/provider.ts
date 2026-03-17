// provider.ts

import axios from "axios";
import { handleResponse, handleError } from "./response";
import { BASE_URL } from "../api";

const getToken = () => localStorage.getItem("CRM-token");

const getAll = async (resource: string, signal: AbortSignal, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    const response = await axios.get(`${BASE_URL}/${resource}`, {
      signal: signal,
      headers: headers,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getSingle = async (
  resource: string,
  id: string,
  signal: AbortSignal,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.get(`${BASE_URL}/${resource}/${id}`, {
        signal: signal,
        headers: headers,
      });
    } else {
      response = await axios.get(
        `${BASE_URL}/${resource}/${additionalParam}/${id}`,
        {
          signal: signal,
          headers: headers,
        },
      );
    }
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getByParams = async (
  resource: string,
  signal: AbortSignal,
  params: Record<string, unknown>,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.get(`${BASE_URL}/${resource}`, {
        signal: signal,
        headers: headers,
        params: params,
      });
    } else {
      response = await axios.get(`${BASE_URL}/${resource}/${additionalParam}`, {
        signal: signal,
        headers: headers,
        params: params,
      });
    }
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const post = async (
  resource: string,
  model: object,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.post(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.post(
        `${BASE_URL}/${resource}/${additionalParam}`,
        model,
        {
          headers: headers,
        },
      );
    }
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const postFormData = async (
  resource: string,
  model: FormData,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized
    ? {
        "Content-Type": "multipart/form-data",
        "auth-token": `${getToken()}`,
      }
    : { "Content-Type": "multipart/form-data" };

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.post(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.post(
        `${BASE_URL}/${resource}/${additionalParam}`,
        model,
        {
          headers: headers,
        },
      );
    }
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const put = async (resource: string, model: object, additionalParams: string, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParams === "") {
      response = await axios.put(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.put(
        `${BASE_URL}/${resource}/${additionalParams}`,
        model,
        {
          headers: headers,
        },
      );
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const putById = async (resource: string, id: string, model: object, signal: AbortSignal, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};
  try {
    const response = await axios.put(`${BASE_URL}/${resource}/${id}`, model, {
      signal: signal,
      headers: headers,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const putFormData = async (
  resource: string,
  model: FormData,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized
    ? {
        "Content-Type": "multipart/form-data",
        "auth-token": `${getToken()}`,
      }
    : { "Content-Type": "multipart/form-data" };

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.put(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.put(
        `${BASE_URL}/${resource}/${additionalParam}`,
        model,
        {
          headers: headers,
        },
      );
    }
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const patch = async (resource: string, model: object, signal: AbortSignal, isAuthorized = false) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${resource}`, model, {
      signal: signal,
      headers: {
        "auth-token": getToken(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// has no body
const patchByParams = async (
  resource: string,
  additionalParams: string,
  queryParams: string,
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    const request = axios.create({
      method: "PATCH",
      baseURL: `${BASE_URL}/${resource}/${additionalParams}?${queryParams}`,
      headers: headers,
    });
    const response = await request.patch("");
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const remove = async (resource: string, id: string, additionalParams: string, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParams === "") {
      response = await axios.delete(`${BASE_URL}/${resource}/${id}`, {
        headers: headers,
      });
    } else {
      response = await axios.delete(
        `${BASE_URL}/${resource}/${additionalParams}/${id}`,
        {
          headers: headers,
        },
      );
    }
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const apiProvider = {
  getAll,
  getSingle,
  getByParams,
  post,
  postFormData,
  put,
  putById,
  putFormData,
  patch,
  patchByParams,
  remove,
};
