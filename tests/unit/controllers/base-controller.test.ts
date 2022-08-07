import { describe, it, expect } from "vitest";

import { getRoute } from "../../test-utils";
import { BaseRoutes } from "../../../src/utilities";
import baseController from "../../../src/controllers/index";
import { healthCheckHandler } from "../../../src/request-handler";
import authController from "../../../src/controllers/auth-controller";
import userController from "../../../src/controllers/user-controller";

const [healthCheckRoute, authenticationRoutes, usersRoutes] = [
  getRoute(`/${BaseRoutes.HEALTH_CHECK}`, baseController),
  getRoute(`/${BaseRoutes.AUTHENTICATION}`, baseController),
  getRoute(`/${BaseRoutes.USERS}`, baseController),
];

describe("the baseController contains the correct routes and the routes map to the correct methods", () => {
  it("the health check route is configured correctly", () => {
    expect(healthCheckRoute).to.not.be.deep.equal(undefined);
    expect(healthCheckRoute?.[0]).to.deep.equal("GET");
    expect(healthCheckRoute?.[2][0]).toMatchObject(healthCheckHandler);
    expect(healthCheckRoute?.[2][1]).toBeUndefined();
  });

  it("the authentication routes are configured correctly", () => {
    expect(authenticationRoutes).to.not.be.deep.equal(undefined);
    expect(authenticationRoutes?.[0]).to.deep.equal("ALL");
    expect(authenticationRoutes?.[2][0]).toMatchObject(authController.handle);
    expect(authenticationRoutes?.[2][1]).toBeUndefined();
  });

  it("the users routes are configured correctly", () => {
    expect(usersRoutes).to.not.be.deep.equal(undefined);
    expect(usersRoutes?.[0]).to.deep.equal("ALL");
    expect(usersRoutes?.[2][0]).toMatchObject(userController.handle);
    expect(usersRoutes?.[2][1]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(baseController.routes[5]).to.be.deep.equal(undefined);
  });
});
