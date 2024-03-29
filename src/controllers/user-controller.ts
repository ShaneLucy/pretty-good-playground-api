import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import {
  deleteUserHandler,
  getQuestionHandler,
  postAnswerHandler,
  patchUserPasswordHandler,
  patchUserPublicKeyHandler,
  getUserHandler,
} from "../request-handler";
import {
  malformedRequestBodyHandler,
  userAuthenticatedHandler,
  userAuthorisedForAnswer,
  userAuthorisedForQuestion,
} from "../middleware";
import { BaseRoutes, PathParams, responseBuilder } from "../utilities";

const userController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/${BaseRoutes.USERS}`,
});

userController.options(`/:${PathParams.USERNAME}`, async () =>
  responseBuilder({ body: "Success", status: 200, accessControl: "*" })
);

userController.get(`/:${PathParams.USERNAME}`, userAuthenticatedHandler, getUserHandler);

userController.delete(`/:${PathParams.USERNAME}`, userAuthenticatedHandler, deleteUserHandler);

userController.patch(
  `/:${PathParams.USERNAME}/password`,
  userAuthenticatedHandler,
  patchUserPasswordHandler
);
userController.patch(
  `/:${PathParams.USERNAME}/public-key`,
  userAuthenticatedHandler,
  patchUserPublicKeyHandler
);

userController.get(
  `/:${PathParams.USERNAME}/questions/:${PathParams.QUESTION}`,
  userAuthenticatedHandler,
  userAuthorisedForQuestion,
  getQuestionHandler
);

userController.post(
  `/:${PathParams.USERNAME}/answers/:${PathParams.ANSWER}`,
  malformedRequestBodyHandler,
  userAuthenticatedHandler,
  userAuthorisedForAnswer,
  postAnswerHandler
);

export default userController;
