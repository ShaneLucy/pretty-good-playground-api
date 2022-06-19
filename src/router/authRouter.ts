import { Router } from "itty-router";

import type { RouterMethodTypes } from "../types/router-methods";
import { registrationHandler, loginHandler } from "../request-handler";
import malformedRequestBodyHandler from "../middleware/error-handler/malformed-request-body-handler";
import { responseBuilder } from "../utilities";

const authRouter = Router<IRequest, RouterMethodTypes>({ base: `/api/authentication` });

authRouter.all("*", malformedRequestBodyHandler);

authRouter.post("/register", async (request: Request, env: Env) =>
  responseBuilder(await registrationHandler(await request.json(), env.USERS))
);

authRouter.post("/login", async (request: Request, env: Env) =>
  responseBuilder(await loginHandler(await request.json(), env.USERS, env.JWT_SECRET))
);

export default authRouter;
