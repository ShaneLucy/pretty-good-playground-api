import { describe, it, expect } from "vitest";

import userController from "../../../src/controllers/user-controller";
import {
  userAuthenticatedHandler,
  userAuthorisedForAnswer,
  userAuthorisedForQuestion,
  malformedRequestBodyHandler,
} from "../../../src/middleware";
import {
  deleteUserHandler,
  postAnswerHandler,
  getQuestionHandler,
  patchUserHandler,
} from "../../../src/request-handler";

const [
  optionsRoute,
  getUserRoute,
  deleteUserRoute,
  patchUserRoute,
  getQuestionRoute,
  postAnswerRoute,
  undefinedRoute,
] = [
  userController.routes[0],
  userController.routes[1],
  userController.routes[2],
  userController.routes[3],
  userController.routes[4],
  userController.routes[5],
  userController.routes[6],
];

describe("the userController contains the correct routes and the routes map to the correct methods", () => {
  it("the options route is configured correctly", () => {
    expect(optionsRoute).to.not.be.deep.equal(undefined);
    expect(optionsRoute?.[0]).to.deep.equal("OPTIONS");
    expect(optionsRoute?.[1].toString()).to.contain("username");
  });

  it("the getUser route is configured correctly", () => {
    expect(getUserRoute).to.not.be.deep.equal(undefined);
    expect(getUserRoute?.[0]).to.deep.equal("GET");
    expect(getUserRoute?.[1].toString()).to.contain("username");
    expect(getUserRoute?.[2][0]).toMatchObject(userAuthenticatedHandler);
    // TODO add getUserRoute expect(getUserRoute?.[2][1]).toMatchObject(() => {});
    expect(getUserRoute?.[2][2]).toBeUndefined();
  });

  it("the deleteUser route is configured correctly", () => {
    expect(deleteUserRoute).to.not.be.deep.equal(undefined);
    expect(deleteUserRoute?.[0]).to.deep.equal("DELETE");
    expect(deleteUserRoute?.[1].toString()).to.contain("username");
    expect(deleteUserRoute?.[2][0]).toMatchObject(userAuthenticatedHandler);
    expect(deleteUserRoute?.[2][1]).toMatchObject(deleteUserHandler);
    expect(deleteUserRoute?.[2][2]).toBeUndefined();
  });

  it("the patchUser route is configured correctly", () => {
    expect(patchUserRoute).to.not.be.deep.equal(undefined);
    expect(patchUserRoute?.[0]).to.deep.equal("PATCH");
    expect(patchUserRoute?.[2][0]).toMatchObject(userAuthenticatedHandler);
    expect(patchUserRoute?.[2][1]).toMatchObject(patchUserHandler);
    expect(patchUserRoute?.[2][2]).toBeUndefined();
  });

  it("the getQuestion route is configured correctly", () => {
    expect(getQuestionRoute).to.not.be.deep.equal(undefined);
    expect(getQuestionRoute?.[0]).to.deep.equal("GET");
    expect(getQuestionRoute?.[2][0]).toMatchObject(userAuthenticatedHandler);
    expect(getQuestionRoute?.[2][1]).toMatchObject(userAuthorisedForQuestion);
    expect(getQuestionRoute?.[2][2]).toMatchObject(getQuestionHandler);
    expect(getQuestionRoute?.[2][3]).toBeUndefined();
  });

  it("the postAnswer route is configured correctly", () => {
    expect(postAnswerRoute).to.not.be.deep.equal(undefined);
    expect(postAnswerRoute?.[0]).to.deep.equal("POST");
    expect(postAnswerRoute?.[2][0]).toMatchObject(malformedRequestBodyHandler);
    expect(postAnswerRoute?.[2][1]).toMatchObject(userAuthenticatedHandler);
    expect(postAnswerRoute?.[2][2]).toMatchObject(userAuthorisedForAnswer);
    expect(postAnswerRoute?.[2][3]).toMatchObject(postAnswerHandler);
    expect(postAnswerRoute?.[2][4]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(undefinedRoute).to.be.deep.equal(undefined);
  });
});
