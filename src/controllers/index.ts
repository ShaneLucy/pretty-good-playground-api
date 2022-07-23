import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import authController from "./auth-controller";
import userController from "./user-controller";
import questionController from "./question-controller";
import { BaseRoutes } from "../utilities";
import { healthCheckHandler, startHandler } from "../request-handler";

const baseController = Router<CustomRequest, RouterMethodTypes>({ base: `/${BaseRoutes.API}` });

baseController.get(`/${BaseRoutes.HEALTH_CHECK}`, healthCheckHandler);
baseController.get(`/${BaseRoutes.START}`, startHandler);
baseController.all(`/${BaseRoutes.AUTHENTICATION}/*`, authController.handle);
baseController.all(`/${BaseRoutes.USERS}/*`, userController.handle);
baseController.all(`/${BaseRoutes.QUESTIONS}/*`, questionController.handle);

export default baseController;

/**
 * Public Routes
 * /api
 *      /health-check {GET} ✓
 *      /authentication
 *          /register {POST} ✓
 *          /login {POST} ✓
 *      /questions/:id {GET✓, POST}
 *      /start ✓
 *
 * Protected Routes
 * /api
 *      /user/:username {GET, POST, PUT, DELETE ✓}
 *      /user/:username/questions/:id {GET, POST}
 */
