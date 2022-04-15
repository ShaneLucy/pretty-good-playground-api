import router from "./router";

export default {
  async fetch(request: any) {
    return router.handle(request);
  },
};
