import { Router } from "itty-router";

import type { RouterMethodTypes, CustomRequest } from "../types/custom";
import { getQuestion } from "../request-handler";
// import { malformedRequestBodyHandler } from "../middleware";

const questionController = Router<CustomRequest, RouterMethodTypes>({ base: `/api/questions` });

questionController.all("*");

// questionController.post("/:question", malformedRequestBodyHandler, registrationHandler);

questionController.get("/:question", getQuestion);

export default questionController;
