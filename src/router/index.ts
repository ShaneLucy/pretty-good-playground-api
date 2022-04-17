import { Router } from "itty-router";

import { registrationHandler } from "../request-handler";

const router = Router();

router.post("/register", async (request: Request) => Promise.resolve(registrationHandler(request)));

export default router;
