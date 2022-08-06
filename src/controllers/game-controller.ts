import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { postAnswerHandler, getQuestionHandler } from "../request-handler";
import {
  userAuthorisedForQuestion,
  malformedRequestBodyHandler,
  userAuthorisedForAnswer,
} from "../middleware";
import { BaseRoutes, PathParams } from "../utilities";

const gameController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/${BaseRoutes.GAME}`,
});

gameController.post(
  `/${BaseRoutes.ANSWERS}/:${PathParams.ANSWER}`,
  malformedRequestBodyHandler,
  userAuthorisedForAnswer,
  postAnswerHandler
);

gameController.get(
  `/${BaseRoutes.QUESTIONS}/:${PathParams.QUESTION}`,
  userAuthorisedForQuestion,
  getQuestionHandler
);

export default gameController;
