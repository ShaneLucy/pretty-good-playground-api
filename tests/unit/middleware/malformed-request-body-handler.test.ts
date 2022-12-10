import { describe, it, expect, vi } from "vitest";
import "whatwg-fetch";
import { fail } from "assert";

import { malformedRequestBodyHandler } from "../../../src/middleware";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import type { CustomRequest } from "../../../src/types/custom";

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

describe("the malformedRequestBodyHandler function works correctly", () => {
  it("given valid JSON returns undefined", async () => {
    const request = new Request("http://localhost", {
      body: JSON.stringify("Hi!"),
      method: "POST",
    }) as CustomRequest;

    const result = await malformedRequestBodyHandler(request, env);

    expect(result).to.deep.equal(undefined);
  });

  it("given invalid JSON returns a response with the correct status code & body", async () => {
    const request = new Request("http://localhost", {
      body: "Hi!",
      method: "POST",
    }) as CustomRequest;

    const result = await malformedRequestBodyHandler(request, env);

    if (result === undefined) {
      fail();
    }

    expect(result.status).to.deep.equal(HttpStatusCodes.BAD_REQUEST);

    expect(await result.json()).to.deep.equal(`${ResponseMessages.MALFORMED_REQUEST_BODY}`);
  });
});
