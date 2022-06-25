import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { deleteUserHandler } from "../request-handler";
import userAuthenticatedHandler from "../middleware/authentication/user-authenticated-handler";
import malformedRequestBodyHandler from "../middleware/error-handler/malformed-request-body-handler";
import { responseBuilder } from "../utilities";

const userController = Router<CustomRequest, RouterMethodTypes>({ base: `/api/users` });

userController.options("/:uuid", async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);
userController.get("/:uuid", userAuthenticatedHandler, async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);

userController.delete(
  "/:uuid",
  userAuthenticatedHandler,
  malformedRequestBodyHandler,
  deleteUserHandler
);

export default userController;
