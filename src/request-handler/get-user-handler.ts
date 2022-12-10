import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../utilities";
import type { CustomRequest } from "../types/custom";

const getUserHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const { params } = request;
  const param = (params as unknown) as UserParam;

  const user = await env.USERS.get(param?.username);

  if (user === null || user === undefined) {
    return responseBuilder({
      body: ResponseMessages.NOT_FOUND,
      status: HttpStatusCodes.NOT_FOUND,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const { publicKey, questionId } = JSON.parse(user) as UserModelDisplayableFields;

  return responseBuilder({
    body: {
      username: param?.username,
      publicKey,
      questionId,
    },
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
};

export default getUserHandler;
