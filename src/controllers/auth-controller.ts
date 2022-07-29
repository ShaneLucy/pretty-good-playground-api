import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { registrationHandler, loginHandler } from "../request-handler";
import { malformedRequestBodyHandler } from "../middleware";
import { BaseRoutes } from "../utilities";

const authController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/authentication`,
});

authController.all("*", malformedRequestBodyHandler);

authController.post("/register", registrationHandler);

authController.post("/login", loginHandler);

export default authController;
