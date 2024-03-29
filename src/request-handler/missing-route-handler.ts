import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../utilities";

const missingRouteHandler = async (env: Env): Promise<Response> =>
  responseBuilder({
    body: ResponseMessages.NOT_FOUND,
    status: HttpStatusCodes.NOT_FOUND,
    accessControl: env.ALLOWED_ORIGIN,
  });

export default missingRouteHandler;
