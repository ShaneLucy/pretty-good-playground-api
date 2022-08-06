import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../../utilities";
import type { CustomRequest } from "../../types/custom";

const postAnswerHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const body = (await request.json()) as AnswerBody;

  if (body.answer.length === 0 || body.answer === undefined || body.answer === null) {
    return responseBuilder({
      body: ResponseMessages.ANSWER_EMPTY,
      status: HttpStatusCodes.BAD_REQUEST,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }
  const { params } = request;

  const param = (params as unknown) as AnswerParam;

  const answer = await env.ANSWERS.get(param?.answer);

  if (answer === null || answer === undefined) {
    return responseBuilder({
      body: ResponseMessages.ANSWER_NOT_FOUND,
      status: HttpStatusCodes.NOT_FOUND,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  if (body.answer !== answer) {
    return responseBuilder({
      body: ResponseMessages.ANSWER_INCORRECT,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  return responseBuilder({
    body: answer,
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
};

export default postAnswerHandler;
