import { describe, it, expect, vi, afterEach } from "vitest";
import "whatwg-fetch";

import { deleteUserHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import { requestBuilder } from "../../test-utils";

describe("the deleteUserHandler function works correctly", async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const env = {
    USERS: kvNamespace,
    QUESTIONS: kvNamespace,
    PGP_KEY: kvNamespace,
    ANSWERS: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    PRIVATE_KEY_PASSPHRASE: "",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  it(`when given a valid request, returns the correct status, message and deletes the user`, async () => {
    const request = requestBuilder(JSON.stringify({ username: "test" }), "DELETE");
    const response = await deleteUserHandler(request, env);

    expect(kvNamespace.delete).toHaveBeenCalledTimes(1);
    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.SUCCESS);
  });
});
