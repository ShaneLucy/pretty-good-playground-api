import { Router } from "itty-router";

import type { RouterMethodTypes } from "../types/router-methods";

import userAuthenticatedHandler from "../middleware/authentication/user-authenticated-handler";
import { responseBuilder } from "../utilities";

const userRouter = Router<IRequest, RouterMethodTypes>({ base: `/api/users` });

userRouter.options("/:uuid", async () =>
  responseBuilder({ body: "Success", code: 200, accessControl: "*" })
);
userRouter.get("/:uuid", userAuthenticatedHandler, async () =>
  responseBuilder({ body: "Success", code: 200, accessControl: "*" })
);

export default userRouter;
