/* eslint consistent-return: 0 */
// Disabling this rule as itty-router middleware won't work if a value is returned
// In this case, if there are no errors trying to decode the request body the request will
// get forwarded to the request handler
import { verifyJWT } from "../authentication";
import { responseBuilder, HttpStatusCodes, ResponseMessages, Audience } from "../utilities";
import type { CustomRequest } from "../types/custom";

const userAuthorisedForQuestion = async (
  request: CustomRequest,
  env: Env
): Promise<Response | void> => {
  const { params, headers } = request;

  const param = (params as unknown) as QuestionParam;

  const jwt = headers.get("Authorization");
  if (jwt === null) {
    return responseBuilder({
      body: ResponseMessages.UNAUTHORISED,
      status: HttpStatusCodes.UNAUTHORISED,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  if (
    !(await verifyJWT(
      jwt,
      env.JWT_SECRET,
      null,
      param?.question ? parseInt(param.question, 10) : null,
      Audience.QUESTIONS_ANSWERS,
      env.JWT_DURATION_HOURS
    ))
  ) {
    return responseBuilder({
      body: ResponseMessages.UNAUTHORISED,
      status: HttpStatusCodes.UNAUTHORISED,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }
};

export default userAuthorisedForQuestion;
