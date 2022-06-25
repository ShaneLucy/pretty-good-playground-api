import { describe, it, expect } from "vitest";
import { getRoute } from "../../test-utils";
import authController from "../../../src/controllers/auth-controller";
import malformedRequestBodyHandler from "../../../src/middleware/error-handler/malformed-request-body-handler";
import { registrationHandler, loginHandler } from "../../../src/request-handler";

const [loginRoute, registerRoute, allRoute] = [
  getRoute("login", authController),
  getRoute("register", authController),
  getRoute("*", authController),
];

describe("the authController contains the correct routes and the routes map to the correct methods", () => {
  it("the register route is configured correctly", async () => {
    expect(registerRoute).to.not.be.deep.equal(undefined);
    expect(registerRoute?.[0]).to.deep.equal("POST");
    expect(registerRoute?.[2][0]).toMatchObject(registrationHandler);
  });

  it("the login route is configured correctly", async () => {
    expect(loginRoute).to.not.be.deep.equal(undefined);
    expect(loginRoute?.[0]).to.deep.equal("POST");
    expect(loginRoute?.[2][0]).toMatchObject(loginHandler);
  });

  it("the all route handler is configured correctly", async () => {
    expect(allRoute).to.not.be.deep.equal(undefined);
    expect(allRoute?.[0]).to.deep.equal("ALL");
    expect(allRoute?.[2][0]).toMatchObject(malformedRequestBodyHandler);
  });
});
