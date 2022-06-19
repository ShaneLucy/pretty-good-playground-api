/* eslint consistent-return: 0 */
// Disabling this rule as itty-router middleware won't work if a value is returned
// In this case, if there are no errors trying to decode the request body the request will
// get forwarded to the request handler
import { jwtVerify } from "jose";

import { responseBuilder, HttpStatusCodes, ResponseMessages } from "../../utilities";

const userAuthenticatedHandler = async (request: Request, env: Env): Promise<Response | void> => {
  const encoder = new TextEncoder();

  const jwt = request.headers.get("Authorization");

  if (jwt === null) {
    return responseBuilder(ResponseMessages.UNAUTHORISED, HttpStatusCodes.UNAUTHORISED);
  }

  try {
    await jwtVerify(jwt, encoder.encode(env.JWT_SECRET), {
      issuer: "pretty-good-playground",
      audience: "pretty-good-playground",
    });
  } catch (e) {
    return responseBuilder(ResponseMessages.UNAUTHORISED, HttpStatusCodes.UNAUTHORISED);
  }
};

export default userAuthenticatedHandler;
