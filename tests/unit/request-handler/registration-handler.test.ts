import { describe, it, expect, vi } from "vitest";
import { Crypto } from "@peculiar/webcrypto";
import "whatwg-fetch";

import { registrationHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import type { CustomRequest } from "../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */
describe("the registrationHandler function works correctly", () => {
  vi.stubGlobal("crypto", new Crypto());

  vi.mock("../../../../src/utilities/authentication", () => ({
    generateSalt: vi.fn().mockReturnValue("test"),
    convertPlainTextToPasswordHash: vi.fn().mockReturnValue("12345678"),
  }));

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
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  it(`when given a valid username and password returns the correct status & success message`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ username: "test", password: "09483490054" }),
      method: "POST",
    }) as CustomRequest;

    const response = await registrationHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.equal(ResponseMessages.SUCCESS);
  });

  it(`when given an invalid username returns the correct status and error message`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ username: "t es t", password: "09483490589054" }),
      method: "POST",
    }) as CustomRequest;

    const response = await registrationHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.USERNAME_MALFORMED);
  });

  it(`when given an invalid password returns the correct status and error message`, async () => {
    const request = new Request("hi", {
      body: JSON.stringify({ username: "test", password: "123456" }),
      method: "POST",
    }) as CustomRequest;

    const response = await registrationHandler(request, env);
    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.PASSWORD_INVALID);
  });

  it(`when given a username that already exists returns the correct status  error message`, async () => {
    const kvNamespaceWithUserExists = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue("test"),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const envWithUserExists = {
      USERS: kvNamespaceWithUserExists,
      QUESTIONS: kvNamespace,
      PGP_KEY: kvNamespace,
      ANSWERS: kvNamespace,
      JWT_SECRET: "AVerySecretPassphrase",
      ALLOWED_ORIGIN: "*",
      JWT_DURATION_HOURS: 2,
    } as Env;

    const request = new Request("hi", {
      body: JSON.stringify({ username: "test", password: "011589054" }),
      method: "POST",
    }) as CustomRequest;

    const response = await registrationHandler(request, envWithUserExists);

    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.USER_EXISTS);
  });
});
