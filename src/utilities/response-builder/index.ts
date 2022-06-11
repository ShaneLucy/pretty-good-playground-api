import responseHeaders from "../http-headers/response-headers";

const responseBuilder = (message: string, code: number): Response =>
  new Response(JSON.stringify(message), {
    headers: responseHeaders,
    status: code,
  });

export default responseBuilder;
