import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../utilities";
import type { CustomRequest } from "../types/custom";

const getQuestionHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const { params } = request;
  const param = (params as unknown) as QuestionParam;

  const question = await env.QUESTIONS.get(param?.question);

  if (question === null || question === undefined) {
    return responseBuilder({
      body: ResponseMessages.NOT_FOUND,
      status: HttpStatusCodes.NOT_FOUND,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  return responseBuilder({
    body: question,
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
};

export default getQuestionHandler;
