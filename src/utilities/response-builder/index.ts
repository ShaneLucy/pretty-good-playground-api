import responseHeaders from "../http-headers/response-headers";

const responseBuilder = ({ body, code }: ResponseData): Response =>
  new Response(JSON.stringify(body), {
    headers: responseHeaders,
    status: code,
  });

export default responseBuilder;
