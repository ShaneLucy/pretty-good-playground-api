import type { CustomRequest } from "../../src/types/custom";

const requestBuilder = (body: any, method: RequestMethodTypes, headers: {} = {}): CustomRequest => {
  if (method === "GET") {
    return new Request("http://localhost", {
      method,
      headers,
    }) as CustomRequest;
  }
  return new Request("http://localhost", {
    body,
    method,
    headers,
  }) as CustomRequest;
};

export default requestBuilder;
