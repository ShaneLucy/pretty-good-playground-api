import { describe, it, expect, vi } from "vitest";
import { Crypto } from "@peculiar/webcrypto";

import { loginHandler } from "../../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";

vi.stubGlobal("crypto", new Crypto());

describe("the loginHandler function works correctly", async () => {
  const salt = "salt";
  const password = "12345678";
  const uuid = "uuid";
  const kvNamespaceGetNull = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(null),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  vi.mock("../../../../src/authentication", () => ({
    generateJWT: vi.fn().mockReturnValue("jwt"),
    convertPlainTextToPasswordHash: vi.fn().mockReturnValue("12345678"),
  }));

  it(`when given a valid username and password returns the correct status, a valid jwt, username & uuid`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(JSON.stringify({ salt, password, uuid, username: "test" })),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };
    const response = await loginHandler({ password, username: "test" }, kvNamespace, "secret", "*");

    if (!(response.body instanceof Object)) {
      throw new TypeError("");
    }
    expect(response.code).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(response.body.authToken).to.be.equal("jwt");
    expect(response.body.username).to.be.equal("test");
    expect(response.body.uuid).to.be.equal(uuid);
  });

  it(`when given a username that doesn't exist it returns the correct status and code`, async () => {
    const response = await loginHandler(
      { username: "test", password: "09483490589054" },
      kvNamespaceGetNull,
      "secret",
      "*"
    );

    expect(response.code).to.be.equal(HttpStatusCodes.NOT_FOUND);
    expect(response.body).to.be.equal(ResponseMessages.USER_NOT_FOUND);
  });

  it(`when given an invalid password returns the correct status and error message`, async () => {
    const response = await loginHandler(
      { username: "validUsername", password: "*" },
      kvNamespaceGetNull,
      "secret",
      "*"
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.equal(ResponseMessages.PASSWORD_INVALID);
  });

  it(`when given an invalid username returns the correct status and error message`, async () => {
    const response = await loginHandler(
      { username: "not a valid username", password: "valid password" },
      kvNamespaceGetNull,
      "secret",
      "*"
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.equal(ResponseMessages.USERNAME_MALFORMED);
  });

  it(`when the given password doesn't match the stored password, it returns the correct status and code`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi
        .fn()
        .mockReturnValue(JSON.stringify({ salt, password: "password123", username: "test" })),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const response = await loginHandler(
      { username: "valid", password: "12345678" },
      kvNamespace,
      "secret",
      "*"
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.equal(ResponseMessages.INCORRECT_CREDENTIALS);
  });
});