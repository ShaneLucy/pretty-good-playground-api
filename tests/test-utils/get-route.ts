import type { Router } from "itty-router";
import type { CustomRequest, RouterMethodTypes } from "../../src/types/custom";

const getRoute = (path: string, controller: Router<CustomRequest, RouterMethodTypes>) =>
  controller.routes.find((route) => route[1].toString().includes(path));

export default getRoute;
