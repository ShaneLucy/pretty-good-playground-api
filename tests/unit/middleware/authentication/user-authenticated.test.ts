/* eslint no-underscore-dangle: 0 */
import { describe, it, expect, vi } from "vitest";
import "whatwg-fetch";

import userAuthenticatedRequestHandler from "../../../../src/middleware/authentication/user-authenticated-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
import { generateJWT } from "../../../../src/authentication";

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

const env = {
  USERS: kvNamespace,
  JWT_SECRET,
  ALLOWED_ORIGIN: "*",
};

describe("the userAuthenticatedRequestHandler function works correctly", () => {
  it("given valid JWT & valid body returns undefined", async () => {
    const result = await userAuthenticatedRequestHandler(
      new Request("hi", {
        body: JSON.stringify("Hi!"),
        method: "POST",
        headers: {
          Authorization: await generateJWT("test", JWT_SECRET),
        },
      }),
      env
    );

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
      }),
      env
    );

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });

  it("given a request without a JWT returns a response with the correct status code & body", async () => {
    const result = await userAuthenticatedRequestHandler(
      new Request("hi", {
        body: JSON.stringify("Hi!"),
        method: "POST",
      }),
      env
    );

    expect(result?.status).to.deep.equal(HttpStatusCodes.UNAUTHORISED);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.UNAUTHORISED}"`);
  });
});
