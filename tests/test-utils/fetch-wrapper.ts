import fetch, { Response } from "node-fetch";

type RequestMethod = "GET" | "POST";

const fetchWrapper = async (
  requestUrl: string,
  method: RequestMethod,
  data: Object
): Promise<Response> => {
  try {
    return await fetch(requestUrl, {
      method,
      body: JSON.stringify(data),
    });
  } catch (e) {
    const error = e as Error;
    throw new Error(`Error in request:\n${error.message}`);
  }
};

export default fetchWrapper;
