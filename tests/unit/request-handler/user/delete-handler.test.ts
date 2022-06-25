import { describe, it, expect, vi, afterEach } from "vitest";
import "whatwg-fetch";

import { deleteUserHandler } from "../../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
import type { CustomRequest } from "../../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */

describe("the deleteUserHandler function works correctly", async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const username = "someuser";

  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(username),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const kvNamespaceWithoutUser = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(null),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const env = {
    USERS: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  };

  const envWithoutUser = {
    USERS: kvNamespaceWithoutUser,
    JWT_SECRET: "AVerySecretPassphrase",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  };

  it(`when given a valid request, returns the correct status, message and deletes the user`, async () => {
    const response = await deleteUserHandler(
      new Request("hi", {
        body: JSON.stringify({ username: "test" }),
        method: "DELETE",
      }) as CustomRequest,
      env
    );

    expect(kvNamespace.delete).toHaveBeenCalledTimes(1);
    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.SUCCESS);
  });

  it("when the request is missing a username, returns the correct status, message and the delete function isn't called", async () => {
    const response = await deleteUserHandler(
      new Request("hi", {
        body: JSON.stringify(null),
        method: "DELETE",
      }) as CustomRequest,
      env
    );

    expect(kvNamespace.delete).toHaveBeenCalledTimes(0);
    expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.BAD_REQUEST);
  });

  it("when the user doesn't exist, returns the correct status, message and the delete function isn't called", async () => {
    const response = await deleteUserHandler(
      new Request("hi", {
        body: JSON.stringify({ username: "test" }),
        method: "DELETE",
      }) as CustomRequest,
      envWithoutUser
    );

    expect(kvNamespaceWithoutUser.delete).toHaveBeenCalledTimes(0);
    expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.BAD_REQUEST);
  });
});
