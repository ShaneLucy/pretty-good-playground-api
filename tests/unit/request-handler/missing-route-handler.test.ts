import { describe, it, expect, vi } from "vitest";

import "whatwg-fetch";

import { missingRouteHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

describe("the missingRouteHandler function works correctly", () => {
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

  it(`returns a successful response`, async () => {
    const response = await missingRouteHandler(env);

    expect(response.status).to.be.equal(HttpStatusCodes.NOT_FOUND);
    expect(await response.json()).to.be.equal(ResponseMessages.NOT_FOUND);
  });
});
