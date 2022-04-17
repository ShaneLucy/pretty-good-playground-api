import router from "./router";

export default {
  async fetch(request: Request) {
    return router.handle(request);
  },
};
