/* eslint consistent-return: 0 */
// Disabling this rule as itty-router middleware won't work if a value is returned
// In this case, if there are no errors trying to decode the request body the request will
// get forwarded to the request handler
import { responseBuilder, HttpStatusCodes, ResponseMessages } from "../utilities";
import type { CustomRequest } from "../types/custom";

const malformedRequestBodyHandler = async (
  request: CustomRequest,
  env: Env
): Promise<Response | void> => {
  try {
    const requestClone = request.clone();
    await requestClone.json();
  } catch (e) {
    return responseBuilder({
      body: ResponseMessages.MALFORMED_REQUEST_BODY,
      status: HttpStatusCodes.BAD_REQUEST,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }
};

export default malformedRequestBodyHandler;
