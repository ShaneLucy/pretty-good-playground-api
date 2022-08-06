import { describe, it, expect } from "vitest";

import { getRoute } from "../../test-utils";
import { BaseRoutes } from "../../../src/utilities";
import baseController from "../../../src/controllers/index";
import { startHandler, healthCheckHandler } from "../../../src/request-handler";
import authController from "../../../src/controllers/auth-controller";
import userController from "../../../src/controllers/user-controller";
import gameController from "../../../src/controllers/game-controller";

const [healthCheckRoute, startRoute, authenticationRoutes, usersRoutes, gameRoutes] = [
  getRoute(`/${BaseRoutes.HEALTH_CHECK}`, baseController),
  getRoute(`/${BaseRoutes.START}`, baseController),
  getRoute(`/${BaseRoutes.AUTHENTICATION}`, baseController),
  getRoute(`/${BaseRoutes.USERS}`, baseController),
  getRoute(`/${BaseRoutes.GAME}`, baseController),
];

describe("the baseController contains the correct routes and the routes map to the correct methods", () => {
  it("the health check route is configured correctly", async () => {
    expect(healthCheckRoute).to.not.be.deep.equal(undefined);
    expect(healthCheckRoute?.[0]).to.deep.equal("GET");
    expect(healthCheckRoute?.[2][0]).toMatchObject(healthCheckHandler);
    expect(healthCheckRoute?.[2][1]).toBeUndefined();
  });

  it("the start route is configured correctly", async () => {
    expect(startRoute).to.not.be.deep.equal(undefined);
    expect(startRoute?.[0]).to.deep.equal("GET");
    expect(startRoute?.[2][0]).toMatchObject(startHandler);
    expect(startRoute?.[2][1]).toBeUndefined();
  });

  it("the authentication routes are configured correctly", async () => {
    expect(authenticationRoutes).to.not.be.deep.equal(undefined);
    expect(authenticationRoutes?.[0]).to.deep.equal("ALL");
    expect(authenticationRoutes?.[2][0]).toMatchObject(authController.handle);
    expect(authenticationRoutes?.[2][1]).toBeUndefined();
  });

  it("the users routes are configured correctly", async () => {
    expect(usersRoutes).to.not.be.deep.equal(undefined);
    expect(usersRoutes?.[0]).to.deep.equal("ALL");
    expect(usersRoutes?.[2][0]).toMatchObject(userController.handle);
    expect(usersRoutes?.[2][1]).toBeUndefined();
  });

  it("the game routes are configured correctly", async () => {
    expect(gameRoutes).to.not.be.deep.equal(undefined);
    expect(gameRoutes?.[0]).to.deep.equal("ALL");
    expect(gameRoutes?.[2][0]).toMatchObject(gameController.handle);
    expect(gameRoutes?.[2][1]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(baseController.routes[5]).to.be.deep.equal(undefined);
  });
});
