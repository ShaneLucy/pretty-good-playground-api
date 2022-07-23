import { HttpStatusCodes, ResponseMessages, responseBuilder, Audience } from "../../utilities";
import { generateJWT } from "../../authentication";
import type { CustomRequest } from "../../types/custom";

const startHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const { headers } = request;

  if (headers.get("Authorization") !== null) {
    return responseBuilder({
      body: ResponseMessages.BAD_REQUEST,
      status: HttpStatusCodes.BAD_REQUEST,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  return responseBuilder({
    body: await generateJWT(
      { questionId: "1" },
      env.JWT_SECRET,
      env.JWT_DURATION_HOURS,
      Audience.QUESTIONS_ANSWERS
    ),
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
};

export default startHandler;
