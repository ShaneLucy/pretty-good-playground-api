import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { deleteUserHandler } from "../request-handler";
import { userAuthenticatedHandler } from "../middleware";
import { BaseRoutes, responseBuilder } from "../utilities";

const userController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/users`,
});

userController.options("/:username", async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);
userController.get("/:username", userAuthenticatedHandler, async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);

userController.delete("/:username", userAuthenticatedHandler, deleteUserHandler);

export default userController;
