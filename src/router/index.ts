import { Router } from "itty-router";

import { registrationHandler, loginHandler } from "../request-handler";
import { responseBuilder } from "../utilities";

const router = Router();

router.post("/register", async (request: Request, env: Env) => {
  const result = await registrationHandler(await request.json(), env.USERS);
  return responseBuilder(result.message, result.code);
});

router.post("/login", async (request: Request, env: Env) => {
  const result = await loginHandler(await request.json(), env.USERS, env.JWT_SECRET);
  return responseBuilder(result.message, result.code);
});

export default router;
