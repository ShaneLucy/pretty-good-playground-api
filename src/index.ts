import router from "./router";
import { HttpStatusCodes, responseBuilder } from "./utilities";

export default {
  async fetch(request: Request, env: Env) {
    try {
      return await router.handle(request, env);
    } catch (e) {
      return responseBuilder("Internal Server Error", HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
