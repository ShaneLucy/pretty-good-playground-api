import { describe, it, expect, vi } from "vitest";

import "whatwg-fetch";

import { startHandler } from "../../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
import type { CustomRequest } from "../../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */
describe("the startHandler function works correctly", () => {
  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  vi.mock("../../../../src/authentication", () => ({
    generateJWT: vi.fn().mockReturnValue("jwt"),
  }));

  const env = {
    USERS: kvNamespace,
    QUESTIONS: kvNamespace,
    PGP_KEY: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  it(`when given a request without an authorization header, returns a JWT`, async () => {
    const request = new Request("hi", {
      method: "GET",
      headers: {},
    }) as CustomRequest;

    const response = await startHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.equal("jwt");
  });

  it(`when given a request without any headers, returns a JWT`, async () => {
    const request = new Request("hi", {
      method: "GET",
    }) as CustomRequest;

    const response = await startHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.equal("jwt");
  });

  it(`when given a request with an authorization header, returns the correct status and message`, async () => {
    const request = new Request("hi", {
      method: "GET",
      headers: {
        Authorization: "",
      },
    }) as CustomRequest;

    const response = await startHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    expect(await response.json()).to.be.equal(ResponseMessages.BAD_REQUEST);
  });
});
