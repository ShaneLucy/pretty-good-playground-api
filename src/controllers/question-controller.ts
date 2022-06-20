import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { getQuestionHandler } from "../request-handler";
import { userAuthorisedForQuestion } from "../middleware";
import { BaseRoutes } from "../utilities";

const questionController = Router<CustomRequest, RouterMethodTypes>({
  base: `/${BaseRoutes.API}/questions`,
});

questionController.all("*/:question", userAuthorisedForQuestion);

// questionController.post("/:question", malformedRequestBodyHandler, registrationHandler);

questionController.get("/:question", getQuestionHandler);

export default questionController;
