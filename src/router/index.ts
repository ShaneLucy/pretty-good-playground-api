import { Router } from "itty-router";

import { registrationHandler } from "../request-handler";

const router = Router();

router.post("/register", async (request: Request, env: Env) =>
  Promise.resolve(registrationHandler(request, env.USERS))
);

export default router;
