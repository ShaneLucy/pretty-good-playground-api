/* eslint no-underscore-dangle: 0 */
import { describe, it, expect, vi, afterEach } from "vitest";
import "whatwg-fetch";

import { userAuthenticatedHandler } from "../../../src/middleware";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import * as authentication from "../../../src/authentication";
import type { CustomRequest } from "../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */
describe("the userAuthenticatedHandler function works correctly", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(JSON.stringify({ password: "", salt: "", uuid: "" })),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const JWT_SECRET = "AVerySecretPassphrase";
  const verifyJWTSpy = vi.spyOn(authentication, "verifyJWT");
  const env = {
    JWT_SECRET,
    USERS: kvNamespace,
    QUESTIONS: kvNamespace,
    PGP_KEY: kvNamespace,
    ANSWERS: kvNamespace,
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  it("given valid JWT & valid body returns undefined", async () => {
    const request = new Request("hi", {
      body: JSON.stringify("Hi!"),
      method: "POST",
      headers: {
        Authorization: "",
      },
    }) as CustomRequest;

    verifyJWTSpy.mockImplementationOnce(async () => true);
    const result = await userAuthenticatedHandler(request, env);

    expect(result).to.deep.equal(undefined);
  });

  it("given invalid JWT returns a response with the correct status code & body", async () => {
    const request = new Request("hi", {
      body: JSON.stringify("Hi!"),
      method: "POST",
      headers: {
        Authorization: "",
      },
    }) as CustomRequest;

    verifyJWTSpy.mockImplementationOnce(async () => false);
    const result = await userAuthenticatedHandler(request, env);

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });

  it("given a request without a JWT returns a response with the correct status code & body", async () => {
    const request = new Request("hi", {
      body: JSON.stringify("Hi!"),
      method: "POST",
      headers: {},
    }) as CustomRequest;

    const result = await userAuthenticatedHandler(request, env);

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });

  it("when the username path parameter is for a user that doesn't exist returns the correct status code & body", async () => {
    const kvNamespaceWithoutUser = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const envWithoutUser = {
      JWT_SECRET,
      USERS: kvNamespaceWithoutUser,
      QUESTIONS: kvNamespace,
      PGP_KEY: kvNamespace,
      ANSWERS: kvNamespace,
      ALLOWED_ORIGIN: "*",
      JWT_DURATION_HOURS: 2,
    } as Env;

    const request = new Request("hi", {
      body: JSON.stringify("Hi!"),
      method: "POST",
      headers: {
        Authorization: "",
      },
    }) as CustomRequest;

    const result = await userAuthenticatedHandler(request, envWithoutUser);

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });
});
