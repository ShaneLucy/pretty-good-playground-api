import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { getQuestionHandler } from "../request-handler";
import { userAuthorisedForQuestion } from "../middleware";

const questionController = Router<CustomRequest, RouterMethodTypes>({ base: `/api/questions` });

questionController.all("*/:question", userAuthorisedForQuestion);

// questionController.post("/:question", malformedRequestBodyHandler, registrationHandler);

questionController.get("/:question", getQuestionHandler);

export default questionController;
