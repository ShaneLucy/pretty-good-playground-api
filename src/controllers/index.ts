import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import authController from "./auth-controller";
import userController from "./user-controller";

const baseController = Router<CustomRequest, RouterMethodTypes>({ base: `/api` });

baseController.get("/health-check", () => new Response("Service is Up!"));
baseController.all("/authentication/*", authController.handle);
baseController.all("/users/*", userController.handle);

export default baseController;

/**
 * Public Routes
 * /api
 *      /health-check {GET}
 *      /authentication
 *          /register {POST}
 *          /login {POST}
 *      /questions/ {GET}
 *      /answers/ {GET}
 *
 * Protected Routes
 * /api
 *      /user/:uuid {GET, POST, PUT, DELETE}
 *              /question-progress {GET, POST}
 *              /email-verification/:uhash
 */
