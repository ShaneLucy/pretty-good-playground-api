/* eslint no-underscore-dangle: 0 */
import { describe, it, expect, vi } from "vitest";
import "whatwg-fetch";

import userAuthenticatedRequestHandler from "../../../../src/middleware/authentication/user-authenticated-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
import * as authentication from "../../../../src/authentication";
import type { CustomRequest } from "../../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */

const kvNamespace = {
  put: vi.fn(),
  get: vi.fn(),
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

describe("the userAuthenticatedRequestHandler function works correctly", () => {
  it("given valid JWT & valid body returns undefined", async () => {
    const request = new Request("hi", {
      body: JSON.stringify("Hi!"),
      method: "POST",
      headers: {
        Authorization: "",
      },
    }) as CustomRequest;

    verifyJWTSpy.mockImplementationOnce(async () => true);
    const result = await userAuthenticatedRequestHandler(request, env);

    expect(result).to.deep.equal(undefined);
  });

  it("given invalid JWT returns a response with the correct status code & body", async () => {
    const result = await userAuthenticatedRequestHandler(
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
    const result = await userAuthenticatedRequestHandler(
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
});
