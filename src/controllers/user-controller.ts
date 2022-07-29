import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { deleteUserHandler } from "../request-handler";
import { userAuthenticatedHandler } from "../middleware";
import { BaseRoutes, PathParams, responseBuilder } from "../utilities";

const userController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/users`,
});

userController.options(`/:${PathParams.USERNAME}`, async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);
userController.get(`/:${PathParams.USERNAME}`, userAuthenticatedHandler, async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);

userController.delete(`/:${PathParams.USERNAME}`, userAuthenticatedHandler, deleteUserHandler);

export default userController;
