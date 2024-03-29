import { describe, it, expect } from "vitest";
import { getRoute } from "../../test-utils";
import authController from "../../../src/controllers/auth-controller";
import { malformedRequestBodyHandler } from "../../../src/middleware";
import { registrationHandler, loginHandler } from "../../../src/request-handler";

const [loginRoute, registerRoute, allRoute] = [
  getRoute("login", authController),
  getRoute("register", authController),
  getRoute("*", authController),
];

describe("the authController contains the correct routes and the routes map to the correct methods", () => {
  it("the register route is configured correctly", () => {
    expect(registerRoute).to.not.be.deep.equal(undefined);
    expect(registerRoute?.[0]).to.deep.equal("POST");
    expect(registerRoute?.[2][0]).toMatchObject(registrationHandler);
    expect(registerRoute?.[2][1]).toBeUndefined();
  });

  it("the login route is configured correctly", () => {
    expect(loginRoute).to.not.be.deep.equal(undefined);
    expect(loginRoute?.[0]).to.deep.equal("POST");
    expect(loginRoute?.[2][0]).toMatchObject(loginHandler);
    expect(loginRoute?.[2][1]).toBeUndefined();
  });

  it("the all route handler is configured correctly", () => {
    expect(allRoute).to.not.be.deep.equal(undefined);
    expect(allRoute?.[0]).to.deep.equal("ALL");
    expect(allRoute?.[2][0]).toMatchObject(malformedRequestBodyHandler);
    expect(allRoute?.[2][1]).toBeUndefined();
  });

  it("contains the correct amount of routes", () => {
    expect(authController.routes[3]).to.be.deep.equal(undefined);
  });
});
