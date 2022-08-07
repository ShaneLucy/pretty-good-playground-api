import { describe, it, expect } from "vitest";

import userController from "../../../src/controllers/user-controller";
import { userAuthenticatedHandler } from "../../../src/middleware";
import { deleteUserHandler } from "../../../src/request-handler";
import gameController from "../../../src/controllers/game-controller";

const [optionsRoute, getUserRoute, deleteUserRoute, gameRoutes, undefinedRoute] = [
  userController.routes[0],
  userController.routes[1],
  userController.routes[2],
  userController.routes[3],
  userController.routes[4],
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

  it("the deleteUser route handler is configured correctly", () => {
    expect(deleteUserRoute).to.not.be.deep.equal(undefined);
    expect(deleteUserRoute?.[0]).to.deep.equal("DELETE");
    expect(deleteUserRoute?.[1].toString()).to.contain("username");
    expect(deleteUserRoute?.[2][0]).toMatchObject(userAuthenticatedHandler);
    expect(deleteUserRoute?.[2][1]).toMatchObject(deleteUserHandler);
    expect(deleteUserRoute?.[2][2]).toBeUndefined();
  });

  it("the gameRoute handler is configured correctly", () => {
    expect(gameRoutes).to.not.be.deep.equal(undefined);
    expect(gameRoutes?.[0]).to.deep.equal("ALL");
    expect(gameRoutes?.[2][0]).toMatchObject(userAuthenticatedHandler);
    expect(gameRoutes?.[2][1]).toMatchObject(gameController.handle);
    expect(gameRoutes?.[2][2]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(undefinedRoute).to.be.deep.equal(undefined);
  });
});
