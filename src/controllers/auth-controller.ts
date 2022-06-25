import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { registrationHandler, loginHandler } from "../request-handler";
import malformedRequestBodyHandler from "../middleware/error-handler/malformed-request-body-handler";

const authController = Router<CustomRequest, RouterMethodTypes>({ base: `/api/authentication` });

authController.all("*", malformedRequestBodyHandler);

authController.post("/register", registrationHandler);

authController.post("/login", loginHandler);

export default authController;
