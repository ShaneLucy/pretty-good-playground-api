import { describe, it, expect } from "vitest";

import questionController from "../../../src/controllers/question-controller";
import { userAuthorisedForQuestion } from "../../../src/middleware";
import { getQuestionHandler } from "../../../src/request-handler";

const [allRoute, getQuestionRoute, undefinedRoute] = [
  questionController.routes[0],
  questionController.routes[1],
  questionController.routes[2],
];

describe("the questionController contains the correct routes and the routes map to the correct methods", () => {
  it("the all route is configured correctly", async () => {
    expect(allRoute).to.not.be.deep.equal(undefined);
    expect(allRoute?.[0]).to.deep.equal("ALL");
    expect(allRoute?.[2][0]).toMatchObject(userAuthorisedForQuestion);
    expect(allRoute?.[2][1]).toBeUndefined();
  });

  it("the getQuestion route is configured correctly", async () => {
    expect(getQuestionRoute).to.not.be.deep.equal(undefined);
    expect(getQuestionRoute?.[0]).to.deep.equal("GET");
    expect(getQuestionRoute?.[2][0]).toMatchObject(getQuestionHandler);
    expect(getQuestionRoute?.[2][2]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(undefinedRoute).to.be.deep.equal(undefined);
  });
});
