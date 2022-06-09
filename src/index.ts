import router from "./router";
import { HttpStatusCodes, responseBuilder } from "./utilities";

export default {
  async fetch(request: Request, env: Env) {
    try {
      return await router.handle(request, env);
    } catch (e) {
      const error = e as Error;
      return responseBuilder(error.message, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
