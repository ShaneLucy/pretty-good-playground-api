import { describe, it, expect, vi } from "vitest";

import "whatwg-fetch";

import { getUserHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import type { CustomRequest } from "../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */
describe("the getUserHandler function works correctly", () => {
  it(`when a user that exists returns the correct fields`, async () => {
    const salt = "salt";
    const password = "12345678";
    const questionId = "2";
    const publicKey = "publicKey";
    const username = "username";

    const userModel: UserModel = {
      salt,
      password,
      questionId,
      publicKey,
      username,
    };

    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(JSON.stringify(userModel)),
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

    const request = new Request("http://localhost", {
      method: "GET",
    }) as CustomRequest;

    const response = await getUserHandler(request, env);

    const responseData = (await response.json()) as UserModel;

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(responseData.publicKey).to.be.equal(publicKey);
    expect(responseData.questionId).to.be.deep.equal(questionId);
    expect(responseData.publicKey).to.be.deep.equal(publicKey);
    expect(responseData.password).to.be.deep.equal(undefined);
    expect(responseData.salt).to.be.deep.equal(undefined);
  });

  it(`when a user that doesn't exist returns the correct status and message`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
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

    const request = new Request("http://localhost", {
      method: "GET",
    }) as CustomRequest;

    const response = await getUserHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.NOT_FOUND);
    expect(await response.json()).to.be.equal(ResponseMessages.NOT_FOUND);
  });
});
