const responseBuilder = (message: string, code: number): Response =>
  new Response(JSON.stringify(message), {
    headers: {
      "Content-type": "application/json",
    },
    status: code,
  });

export default responseBuilder;
