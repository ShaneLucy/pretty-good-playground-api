/* eslint consistent-return: 0 */
// Disabling this rule as itty-router middleware won't work if a value is returned
// In this case, if there are no errors trying to decode the request body the request will
// get forwarded to the request handler
import { verifyJWT } from "../../authentication";
import { responseBuilder, HttpStatusCodes, ResponseMessages } from "../../utilities";
import type { CustomRequest } from "../../types/custom";

const userAuthenticatedHandler = async (
  request: CustomRequest,
  env: Env
): Promise<Response | void> => {
  const { params, headers } = request;

  if (headers === undefined) {
    return responseBuilder({
      body: ResponseMessages.UNAUTHORISED,
      status: HttpStatusCodes.UNAUTHORISED,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const jwt = headers.get("Authorization");
  if (jwt === null) {
    return responseBuilder({
      body: ResponseMessages.UNAUTHORISED,
      status: HttpStatusCodes.UNAUTHORISED,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  if (!(await verifyJWT(jwt, env.JWT_SECRET, params?.uuid, env.JWT_DURATION_HOURS))) {
    return responseBuilder({
      body: ResponseMessages.UNAUTHORISED,
      status: HttpStatusCodes.UNAUTHORISED,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }
};

export default userAuthenticatedHandler;
