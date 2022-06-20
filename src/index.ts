import baseController from "./controllers";
import { HttpStatusCodes, responseBuilder, ResponseMessages } from "./utilities";
import type { CustomRequest } from "./types/custom";

export default {
  async fetch(request: CustomRequest, env: Env) {
    try {
      return await baseController.handle(request, env);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
      return responseBuilder({
        body: ResponseMessages.INTERNAL_SERVER_ERROR,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        accessControl: env.ALLOWED_ORIGIN,
      });
    }
  },
};
