/* eslint no-underscore-dangle: 0 */
import { describe, it, expect, vi } from "vitest";
import "whatwg-fetch";

import { malformedRequestBodyHandler } from "../../../../src/middleware";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
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

const env = {
  USERS: kvNamespace,
  JWT_SECRET: "AVerySecretPassphrase",
  ALLOWED_ORIGIN: "*",
  JWT_DURATION_HOURS: 2,
};

describe("the malformedRequestBodyHandler function works correctly", () => {
  it("given valid JSON returns undefined", async () => {
    const result = await malformedRequestBodyHandler(
      new Request("hi", { body: JSON.stringify("Hi!"), method: "POST" }) as CustomRequest,
      env
    );

    expect(result).to.deep.equal(undefined);
  });

  it("given invalid JSON returns a response with the correct status code & body", async () => {
    const result = await malformedRequestBodyHandler(
      new Request("hi", { body: "Hi!", method: "POST" }) as CustomRequest,
      env
    );

    expect(result?.status).to.deep.equal(HttpStatusCodes.BAD_REQUEST);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.MALFORMED_REQUEST_BODY}"`);
  });
});
