// core.ts

import { apiProvider } from "./provider";

interface ApiCoreOptions {
  url: string;
  getAll?: boolean;
  getSingle?: boolean;
  getByParams?: boolean;
  post?: boolean;
  postFormData?: boolean;
  put?: boolean;
  putById?: boolean;
  putFormData?: boolean;
  patch?: boolean;
  patchByParams?: boolean;
  remove?: boolean;
}

export class ApiCore {
  getAll?: (signal: AbortSignal, isAuthorized?: boolean) => Promise<any>;
  getSingle?: (id: string, signal: AbortSignal, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  getByParams?: (params: Record<string, unknown>, signal: AbortSignal, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  post?: (model: object, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  postFormData?: (model: FormData, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  put?: (model: object, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  putById?: (id: string, model: object, signal: AbortSignal, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  putFormData?: (model: FormData, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  patch?: (model: object, signal: AbortSignal, additionalParam?: string, isAuthorized?: boolean) => Promise<any>;
  patchByParams?: (additionalParams: string, queryParams: string, isAuthorized?: boolean) => Promise<any>;
  remove?: (id: string, additionalParams: string, isAuthorized?: boolean) => Promise<any>;

  constructor(options: ApiCoreOptions) {
    if (options.getAll) {
      this.getAll = (signal, isAuthorized) => {
        return apiProvider.getAll(
          options.url,
          signal,
          isAuthorized
        );
      };
    }

    if (options.getSingle) {
      this.getSingle = (id, signal, additionalParam, isAuthorized) => {
        return apiProvider.getSingle(
          options.url,
          id,
          signal,
          additionalParam,
          isAuthorized
        );
      };
    }

    if (options.getByParams) {
      this.getByParams = (params, signal, additionalParam, isAuthorized) => {
        return apiProvider.getByParams(
          options.url,
          signal,
          params,
          additionalParam,
          isAuthorized
        );
      };
    }

    if (options.post) {
      this.post = (model, additionalParam, isAuthorized) => {
        return apiProvider.post(
          options.url,
          model,
          additionalParam,
          isAuthorized
        );
      };
    }

    if (options.postFormData) {
      this.postFormData = (model, additionalParam, isAuthorized) => {
        return apiProvider.postFormData(
          options.url,
          model,
          additionalParam,
          isAuthorized
        );
      };
    }

    if (options.put) {
      this.put = (model, additionalParam, isAuthorized) => {
        return apiProvider.put(
          options.url,
          model,
          additionalParam ?? "",
          isAuthorized
        );
      };
    }

    if (options.putById) {
      this.putById = (id, model, signal, _additionalParam, isAuthorized) => {
        return apiProvider.putById(
          options.url,
          id,
          model,
          signal,
          isAuthorized
        );
      };
    }

    if (options.putFormData) {
      this.putFormData = (model, additionalParam, isAuthorized) => {
        return apiProvider.putFormData(
          options.url,
          model,
          additionalParam,
          isAuthorized
        );
      };
    }

    if (options.patch) {
      this.patch = (model, signal, _additionalParam, isAuthorized) => {
        return apiProvider.patch(
          options.url,
          model,
          signal,
          isAuthorized
        );
      };
    }

    if (options.patchByParams) {
      this.patchByParams = (additionalParams, queryParams, isAuthorized) => {
        return apiProvider.patchByParams(
          options.url,
          additionalParams,
          queryParams,
          isAuthorized
        );
      };
    }

    if (options.remove) {
      this.remove = (id, additionalParams, isAuthorized) => {
        return apiProvider.remove(
          options.url,
          id,
          additionalParams,
          isAuthorized
        );
      };
    }
  }
}
