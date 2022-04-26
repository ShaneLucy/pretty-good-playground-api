import { Router } from "itty-router";

import { registrationHandler } from "../request-handler";

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

export default router;
