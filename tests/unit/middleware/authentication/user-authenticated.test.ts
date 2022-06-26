/* eslint no-underscore-dangle: 0 */
import { describe, it, expect, vi, afterEach } from "vitest";
import "whatwg-fetch";

import { userAuthenticatedHandler } from "../../../../src/middleware";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
import * as authentication from "../../../../src/authentication";
import type { CustomRequest } from "../../../../src/types/custom";

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
    USERS: kvNamespace,
    JWT_SECRET,
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  };

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
    const result = await userAuthenticatedHandler(
      new Request("hi", {
        body: JSON.stringify("Hi!"),
        method: "POST",
        headers: {
          Authorization: "",
        },
      }) as CustomRequest,
      env
    );

    verifyJWTSpy.mockImplementationOnce(async () => false);
    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });

  it("given a request without a JWT returns a response with the correct status code & body", async () => {
    const result = await userAuthenticatedHandler(
      new Request("hi", {
        body: JSON.stringify("Hi!"),
        method: "POST",
      }) as CustomRequest,
      env
    );

    verifyJWTSpy.mockImplementationOnce(async () => false);

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });

  it("when the username path parameter is for a user that doesn't exist, it returns the correct status code & body", async () => {
    const kvNamespaceWithoutUser = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const envWithoutUser = {
      USERS: kvNamespaceWithoutUser,
      JWT_SECRET,
      ALLOWED_ORIGIN: "*",
      JWT_DURATION_HOURS: 2,
    };

    const result = await userAuthenticatedHandler(
      new Request("hi", {
        body: JSON.stringify("Hi!"),
        method: "POST",
      }) as CustomRequest,
      envWithoutUser
    );

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });
});
