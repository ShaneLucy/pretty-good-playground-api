import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { getQuestionHandler } from "../request-handler";
import { userAuthorisedForQuestion } from "../middleware";
import { BaseRoutes, PathParams } from "../utilities";

const questionController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/questions`,
});

questionController.all(`*/:${PathParams.QUESTION}`, userAuthorisedForQuestion);

questionController.get(`*/:${PathParams.QUESTION}`, getQuestionHandler);

export default questionController;
