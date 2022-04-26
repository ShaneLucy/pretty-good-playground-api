import { describe, it, expect, vi } from "vitest";
import { Crypto } from "@peculiar/webcrypto";

import { registrationHandler } from "../../../src/request-handler";
import { HttpStatusCodes, LoggingMessages } from "../../../src/logging";

vi.stubGlobal("crypto", new Crypto());

describe("the registrationHandler function works correctly", () => {
  it(`when given a valid username and password returns the correct status & success message`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const response = await registrationHandler(
      { username: "test", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(response.message).to.be.equal(LoggingMessages.SUCCESS);
  });

  it(`when given an invalid username returns the correct status and error message`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const response = await registrationHandler(
      { username: "t es t", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.message).to.be.equal(LoggingMessages.USERNAME_MALFORMED);
  });

  it(`when given an invalid password returns the correct status and error message`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const response = await registrationHandler(
      { username: "test", password: "123456" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.message).to.be.equal(LoggingMessages.PASSWORD_INVALID);
  });

  it(`when given a username that already exists returns the correct status  error message`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue("test"),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const response = await registrationHandler(
      { username: "test", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.message).to.be.equal(LoggingMessages.USER_EXISTS);
  });
});
