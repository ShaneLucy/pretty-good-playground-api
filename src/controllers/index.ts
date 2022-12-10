import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import authController from "./auth-controller";
import userController from "./user-controller";

import { BaseRoutes } from "../utilities";
import { healthCheckHandler, missingRouteHandler } from "../request-handler";

const baseController = Router<CustomRequest, RouterMethodTypes>();

baseController.get(`/${BaseRoutes.API}/${BaseRoutes.HEALTH_CHECK}`, healthCheckHandler);
baseController.all(`/${BaseRoutes.API}/${BaseRoutes.AUTHENTICATION}/*`, authController.handle);
baseController.all(`/${BaseRoutes.API}/${BaseRoutes.USERS}/*`, userController.handle);
baseController.all("*", missingRouteHandler);

export default baseController;

/**
 * Public Routes
 * /api
 *      /health-check {GET} ✓
 *      /authentication
 *          /register {POST} ✓
 *          /login {POST} ✓
 *      /start ✓
 *
 * Protected Routes
 * /api
 *      /user/:username {GET, POST, PUT, DELETE ✓}
 *      /user/questions/:id {GET✓}
 *      /user/answers/:id {POST}
 */
