import { Router } from "itty-router";

import authRouter from "./authRouter";

const router = Router({ base: `/api` });

router.all("/authentication/*", authRouter.handle);

export default router;
