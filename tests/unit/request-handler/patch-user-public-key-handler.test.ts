import { describe, it, expect, vi } from "vitest";
import "whatwg-fetch";

import { patchUserPublicKeyHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import { validPublicKey, requestBuilder } from "../../test-utils";

describe("the patchUserPublicKeyHandler function works correctly", async () => {
  const salt = "salt";
  const password = "12345678";
  const questionId = 2;

  const kvNamespace = {
    put: vi.fn(),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
    get: vi.fn().mockReturnValue(JSON.stringify({ salt, password, username: "test", questionId })),
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
    PGP_KEY: kvNamespace,
    ANSWERS: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    PRIVATE_KEY_PASSPHRASE: "",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  it(`when given a valid public key, returns successful response`, async () => {
    const request = requestBuilder(JSON.stringify({ publicKey: validPublicKey }), "PATCH");

    const response = await patchUserPublicKeyHandler(request, env);

    expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.SUCCESS);
  });

  it(`when user not found, returns correct error response`, async () => {
    const request = requestBuilder(JSON.stringify({ publicKey: validPublicKey }), "PATCH");

    const response = await patchUserPublicKeyHandler(request, envGetNull);
    expect(response.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.NOT_FOUND);
  });

  it(`when given an invalid publicKey, returns error correct response`, async () => {
    const request = requestBuilder(JSON.stringify({ publicKey: "12" }), "PATCH");

    const response = await patchUserPublicKeyHandler(request, envGetNull);

    expect(response.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.deep.equal("Misformed armored text");
  });

  it("when publicKey is missing, returns correct error response", async () => {
    const request = requestBuilder(JSON.stringify({}), "PATCH");

    const response = await patchUserPublicKeyHandler(request, envGetNull);

    expect(response.status).to.be.deep.equal(HttpStatusCodes.BAD_REQUEST);
    expect(await response.json()).to.be.deep.equal(ResponseMessages.PUBLIC_KEY_EMPTY);
  });
});
