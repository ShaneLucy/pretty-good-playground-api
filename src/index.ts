import router from "./router";

export default {
  async fetch(request: Request, env: Env) {
    return router.handle(request, env);
  },
};
