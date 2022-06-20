import { Router } from "itty-router";

import type { RouterMethodTypes } from "../types/router-methods";
import authRouter from "./auth-controller";
import userRouter from "./user-controller";

const baseRouter = Router<IRequest, RouterMethodTypes>({ base: `/api` });

baseRouter.get("/health-check", () => new Response("Service is Up!"));
baseRouter.all("/authentication/*", authRouter.handle);
baseRouter.all("/users/*", userRouter.handle);

export default baseRouter;

/**
 * Public Routes
 * /api
 *      /health-check {GET}
 *      /authentication
 *          /register {POST}
 *          /login {POST}
 *      /questions/:uid {GET}
 *      /answers/:uid {GET}
 *
 * Protected Routes
 * /api
 *      /user/:uuid {GET, POST, PUT, DELETE}
 *              /question-progress {GET, POST}
 *              /email-verification/:uhash
 */
