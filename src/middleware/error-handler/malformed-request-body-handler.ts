/* eslint consistent-return: 0 */
// Disabling this rule as itty-router middleware won't work if a value is returned
// In this case, if there are no errors trying to decode the request body the request will
// get forwarded to the request handler
import { responseBuilder, HttpStatusCodes, ResponseMessages } from "../../utilities";

const malformedRequestBodyHandler = async (request: Request): Promise<Response | void> => {
  try {
    const requestClone = request.clone();
    await requestClone.json();
  } catch (e) {
    return responseBuilder({
      body: ResponseMessages.MALFORMED_REQUEST_BODY,
      code: HttpStatusCodes.BAD_REQUEST,
    });
  }
};

export default malformedRequestBodyHandler;
