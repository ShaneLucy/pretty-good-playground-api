import { Router } from "itty-router";

import authRouter from "./authRouter";

const router = Router({ base: `/api` });

router.get("/health-check", () => new Response("Service is Up!"));
router.all("/authentication/*", authRouter.handle);

export default router;
