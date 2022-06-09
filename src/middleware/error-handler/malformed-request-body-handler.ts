/* eslint consistent-return: 0 */
// Disabling this rule as itty-router middleware won't work if a value is returned
// In this case, if there are no errors trying to decode the request body the request will
// get forwarded to the request handler
import { responseBuilder, HttpStatusCodes, LoggingMessages } from "../../utilities";

const malformedRequestBodyHandler = async (request: Request): Promise<Response | void> => {
  try {
    await request.json();
  } catch (e) {
    return responseBuilder(LoggingMessages.MALFORMED_REQUEST_BODY, HttpStatusCodes.BAD_REQUEST);
  }
};

export default malformedRequestBodyHandler;
