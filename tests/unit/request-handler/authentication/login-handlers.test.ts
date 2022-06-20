import { describe, it, expect, vi } from "vitest";
import { Crypto } from "@peculiar/webcrypto";
import "whatwg-fetch";

import { loginHandler } from "../../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";
import type { CustomRequest } from "../../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */

describe("the loginHandler function works correctly", async () => {
  vi.stubGlobal("crypto", new Crypto());
  const salt = "salt";
  const password = "12345678";
  const questionId = "2";

  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(JSON.stringify({ salt, password, username: "test", questionId })),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const env = {
    USERS: kvNamespace,
    QUESTIONS: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  const kvNamespaceGetNull = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(null),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const envGetNull = {
    USERS: kvNamespaceGetNull,
    QUESTIONS: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  vi.mock("../../../../src/authentication", () => ({
    generateJWT: vi.fn().mockReturnValue("jwt"),
    convertPlainTextToPasswordHash: vi.fn().mockReturnValue("12345678"),
  }));

  it(`when given a valid username and password returns the correct status, a valid jwt, username & username`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ password, username: "test" }),
      method: "POST",
    }) as CustomRequest;

    const response = await loginHandler(request, env);

    const responseData = (await response.json()) as LoginResponseBody;

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(responseData.authToken).to.be.equal("jwt");
    expect(responseData.username).to.be.equal("test");
    expect(responseData.questionId).to.be.equal(questionId);
  });

  it(`when given a username that doesn't exist it returns the correct status and message`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ username: "test", password: "09483490589054" }),
      method: "POST",
    }) as CustomRequest;

    const response = await loginHandler(request, envGetNull);

    expect(response.status).to.be.equal(HttpStatusCodes.NOT_FOUND);
    expect(await response.json()).to.be.equal(ResponseMessages.USER_NOT_FOUND);
  });

  it(`when given an invalid password returns the correct status and error message`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ username: "validUsername", password: "*" }),
      method: "POST",
    }) as CustomRequest;

    const response = await loginHandler(request, envGetNull);

    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.PASSWORD_INVALID);
  });

  it(`when given an invalid username returns the correct status and error message`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ username: "not a valid username", password: "valid password" }),
      method: "POST",
    }) as CustomRequest;

    const response = await loginHandler(request, envGetNull);
    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.USERNAME_MALFORMED);
  });

  it(`when the given password doesn't match the stored password, it returns the correct status and message`, async () => {
    const kvNamespaceMismatch = {
      put: vi.fn(),
      get: vi
        .fn()
        .mockReturnValue(JSON.stringify({ salt, password: "password123", username: "test" })),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const envMismatch = {
      USERS: kvNamespaceMismatch,
      QUESTIONS: kvNamespace,
      JWT_SECRET: "AVerySecretPassphrase",
      ALLOWED_ORIGIN: "*",
      JWT_DURATION_HOURS: 2,
    } as Env;

    const request = new Request("hi", {
      body: JSON.stringify({ username: "valid", password: "12345678" }),
      method: "POST",
    }) as CustomRequest;

    const response = await loginHandler(request, envMismatch);

    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.INCORRECT_CREDENTIALS);
  });
});
