import { describe, it, expect } from "vitest";

import gameController from "../../../src/controllers/game-controller";
import { userAuthorisedForQuestion, malformedRequestBodyHandler } from "../../../src/middleware";
import { postAnswerHandler } from "../../../src/request-handler";

import { getQuestionHandler } from "../../../src/request-handler";

const [postAnswerRoute, getQuestionRoute, undefinedRoute] = [
  gameController.routes[0],
  gameController.routes[1],
  gameController.routes[2],
];

describe("the gameController contains the correct routes and the routes map to the correct methods", () => {
  it("the postAnswer route is configured correctly", async () => {
    expect(postAnswerRoute).to.not.be.deep.equal(undefined);
    expect(postAnswerRoute?.[0]).to.deep.equal("POST");
    expect(postAnswerRoute?.[2][0]).toMatchObject(malformedRequestBodyHandler);
    expect(postAnswerRoute?.[2][1]).toMatchObject(userAuthorisedForQuestion);
    expect(postAnswerRoute?.[2][2]).toMatchObject(postAnswerHandler);
    expect(postAnswerRoute?.[2][3]).toBeUndefined();
  });

  it("the getQuestion route is configured correctly", async () => {
    expect(getQuestionRoute).to.not.be.deep.equal(undefined);
    expect(getQuestionRoute?.[0]).to.deep.equal("GET");
    expect(getQuestionRoute?.[2][0]).toMatchObject(userAuthorisedForQuestion);
    expect(getQuestionRoute?.[2][1]).toMatchObject(getQuestionHandler);
    expect(getQuestionRoute?.[2][2]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(undefinedRoute).to.be.deep.equal(undefined);
  });
});
