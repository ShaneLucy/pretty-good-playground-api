import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { registrationHandler, loginHandler } from "../request-handler";
import malformedRequestBodyHandler from "../middleware/error-handler/malformed-request-body-handler";
import { responseBuilder } from "../utilities";

const authController = Router<CustomRequest, RouterMethodTypes>({ base: `/api/authentication` });

authController.all("*", malformedRequestBodyHandler);

authController.post("/register", async (request: Request, env: Env) =>
  responseBuilder(await registrationHandler(await request.json(), env.USERS, env.ALLOWED_ORIGIN))
);

authController.post("/login", async (request: Request, env: Env) =>
  responseBuilder(
    await loginHandler(await request.json(), env.USERS, env.JWT_SECRET, env.ALLOWED_ORIGIN)
  )
);

export default authController;
