import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../../utilities";

const startHandler = async (env: Env): Promise<Response> =>
  responseBuilder({
    body: ResponseMessages.SUCCESS,
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
export default startHandler;
