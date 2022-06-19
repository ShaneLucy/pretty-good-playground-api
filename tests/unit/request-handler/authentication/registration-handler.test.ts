import { describe, it, expect, vi } from "vitest";
import { Crypto } from "@peculiar/webcrypto";

import { registrationHandler } from "../../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../../src/utilities";

vi.stubGlobal("crypto", new Crypto());

vi.mock("../../../../src/utilities/authentication", () => ({
  generateSalt: vi.fn().mockReturnValue("test"),
  convertPlainTextToPasswordHash: vi.fn().mockReturnValue("12345678"),
}));

describe("the registrationHandler function works correctly", () => {
  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(null),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  it(`when given a valid username and password returns the correct status & success message`, async () => {
    const response = await registrationHandler(
      { username: "test", password: "09483490054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(response.body).to.be.equal(ResponseMessages.SUCCESS);
  });

  it(`when given an invalid username returns the correct status and error message`, async () => {
    const response = await registrationHandler(
      { username: "t es t", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.equal(ResponseMessages.USERNAME_MALFORMED);
  });

  it(`when given an invalid password returns the correct status and error message`, async () => {
    const response = await registrationHandler(
      { username: "test", password: "123456" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.equal(ResponseMessages.PASSWORD_INVALID);
  });

  it(`when given a username that already exists returns the correct status  error message`, async () => {
    const kvNamespaceWithGet = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue("test"),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const response = await registrationHandler(
      { username: "test", password: "011589054" },
      kvNamespaceWithGet
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.equal(ResponseMessages.USER_EXISTS);
  });
});
