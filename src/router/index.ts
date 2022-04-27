import { Router } from "itty-router";

import { registrationHandler, loginHandler } from "../request-handler";

const router = Router();

router.post("/register", async (request: Request, env: Env) => {
  const result = await registrationHandler(await request.json(), env.USERS);
  return new Response(JSON.stringify(result.message), {
    headers: {
      "Content-type": "application/json",
    },
    status: result.code,
    statusText: result.message,
  });
});

router.post("/login", async (request: Request, env: Env) => {
  const result = await loginHandler(await request.json(), env.USERS, env.JWT_SECRET);
  const body = result.jwt ? result.jwt : result.message;

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-type": "application/json",
    },
    status: result.code,
    statusText: result.message,
  });
});

export default router;
