import { describe, it, expect, vi } from "vitest";

import { Crypto } from "@peculiar/webcrypto";

import { registrationHandler } from "../../../src/request-handler";

vi.stubGlobal("crypto", new Crypto());

describe("the registrationHandler function works correctly", () => {
  it("when given a valid username and password returns a 200 status & success message", async () => {
    const kvNamespace: any = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
    };

    const response = await registrationHandler(
      { username: "test", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(200);
    expect(response.message).to.be.equal("Success");
  });

  it("when given an invalid username returns a 422 and corresponding error message", async () => {
    const kvNamespace: any = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
    };

    const response = await registrationHandler(
      { username: "t es t", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(422);
    expect(response.message).to.be.equal("Username cannot contain spaces");
  });

  it("when given an invalid password returns a 422 and corresponding error message", async () => {
    const kvNamespace: any = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
    };

    const response = await registrationHandler(
      { username: "test", password: "123456" },
      kvNamespace
    );

    expect(response.code).to.be.equal(422);
    expect(response.message).to.be.equal("Password must be greater than 8 characters");
  });

  it("when given a username that already exists returns a 422 and corresponding error message", async () => {
    const kvNamespace: any = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue("test"),
    };

    const response = await registrationHandler(
      { username: "test", password: "09483490589054" },
      kvNamespace
    );

    expect(response.code).to.be.equal(422);
    expect(response.message).to.be.equal("Username already exists");
  });
});
