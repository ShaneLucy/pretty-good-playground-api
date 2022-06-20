import baseRouter from "./controllers";
import { HttpStatusCodes, responseBuilder } from "./utilities";

export default {
  async fetch(request: IRequest, env: Env) {
    try {
      return await baseRouter.handle(request, env);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
      return responseBuilder({
        body: "Internal Server Error",
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        accessControl: env.ALLOWED_ORIGIN,
      });
    }
  },
};
