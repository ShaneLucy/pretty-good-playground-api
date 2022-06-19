const responseBuilder = ({ body, code, accessControl }: ResponseData): Response =>
  new Response(JSON.stringify(body), {
    headers: new Headers({
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": `${accessControl}`,
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization",
      "Access-Control-Max-Age": "86400",
    }),
    status: code,
  });

export default responseBuilder;
