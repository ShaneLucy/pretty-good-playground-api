import { Router } from "itty-router";

import type { RouterMethodTypes } from "../types/router-methods";

import userAuthenticatedHandler from "../middleware/authentication/user-authenticated";
import { responseBuilder } from "../utilities";

const userRouter = Router<IRequest, RouterMethodTypes>({ base: `/api/users` });

userRouter.options("/:uuid", async () => responseBuilder({ body: "Success", code: 200 }));
userRouter.get("/:uuid", userAuthenticatedHandler, async () =>
  responseBuilder({ body: "Success", code: 200 })
);

export default userRouter;
