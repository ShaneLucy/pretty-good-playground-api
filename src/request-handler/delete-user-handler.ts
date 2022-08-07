import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../utilities";
import type { CustomRequest } from "../types/custom";

const deleteUserHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const { params } = request;
  const param = params as UserParam;

  await env.USERS.delete(param?.username);
  return responseBuilder({
    body: ResponseMessages.SUCCESS,
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
};

export default deleteUserHandler;
