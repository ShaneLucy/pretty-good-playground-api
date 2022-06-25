import { describe, it, expect } from "vitest";

import userController from "../../../src/controllers/user-controller";
import malformedRequestBodyHandler from "../../../src/middleware/error-handler/malformed-request-body-handler";
import userAuthenticatedHandler from "../../../src/middleware/authentication/user-authenticated-handler";
import { deleteUserHandler } from "../../../src/request-handler";

const [optionsRoute, getUserRoute, deleteUserRoute] = [
  userController.routes[0],
  userController.routes[1],
  userController.routes[2],
];

describe("the userController contains the correct routes and the routes map to the correct methods", () => {
  it("the options route is configured correctly", async () => {
    expect(optionsRoute).to.not.be.deep.equal(undefined);
    expect(optionsRoute?.[0]).to.deep.equal("OPTIONS");
    expect(optionsRoute?.[1].toString()).to.contain("uuid");
  });

  it("the getUser route is configured correctly", async () => {
    expect(getUserRoute).to.not.be.deep.equal(undefined);
    expect(getUserRoute?.[0]).to.deep.equal("GET");
    expect(getUserRoute?.[1].toString()).to.contain("uuid");
  });

  it("the deleteUser route handler is configured correctly", async () => {
    expect(deleteUserRoute).to.not.be.deep.equal(undefined);
    expect(deleteUserRoute?.[0]).to.deep.equal("DELETE");
    expect(deleteUserRoute?.[1].toString()).to.contain("uuid");
    expect(deleteUserRoute?.[2][0]).toMatchObject(userAuthenticatedHandler);
    expect(deleteUserRoute?.[2][1]).toMatchObject(malformedRequestBodyHandler);
    expect(deleteUserRoute?.[2][2]).toMatchObject(deleteUserHandler);
  });
});
