import fetch, { Headers, Response } from "node-fetch";

const fetchWrapper = async (
  requestUrl: string,
  requestMethod: RequestMethodTypes,
  body: Object,
  headers?: Headers
): Promise<Response> => {
  try {
    return await fetch(requestUrl, {
      method: requestMethod,
      body: JSON.stringify(body),
      headers,
    });
  } catch (e) {
    const error = e as Error;
    throw new Error(`Error in request:\n${error.message}\n${error.cause}\n${error.stack}`);
  }
};

export default fetchWrapper;
