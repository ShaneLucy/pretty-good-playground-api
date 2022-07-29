import { describe, it, expect, vi } from "vitest";

import "whatwg-fetch";

import { healthCheckHandler } from "../../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";

/**
 * @vitest-environment jsdom
 */
describe("the healthCheckHandler function works correctly", () => {
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
    JWT_SECRET: "AVerySecretPassphrase",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  it(`returns a successful response`, async () => {
    const response = await healthCheckHandler(env);

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.equal(ResponseMessages.SUCCESS);
  });
});
