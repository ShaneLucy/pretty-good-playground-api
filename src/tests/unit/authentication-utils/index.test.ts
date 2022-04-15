import { TextEncoder } from "util";
import { Crypto } from "@peculiar/webcrypto";

import { describe, it, expect } from "vitest";

import {
  generateHash,
  generateSalt,
  encodePassword,
  decodeHash,
} from "../../../authentication-utils";

// @ts-ignore
global.crypto = new Crypto();

describe("the generateHash function works correctly", () => {
  it("returns a different value to its input", async () => {
    const password = "a very secret value";
    const encoder = new TextEncoder();
    const buffer = encoder.encode(password);
    const hash = await generateHash(buffer);

    expect(hash).to.not.deep.equal(buffer);
    expect(hash).to.not.deep.equal(password);
  });
});

describe("the generateSalt function works correctly", () => {
  it("returns a string 36 characters long", () => {
    const salt = generateSalt();
    expect(salt).toHaveLength(35);
  });

  it("when called multiple times, returns different values", () => {
    const [salt1, salt2, salt3] = [generateSalt(), generateSalt(), generateSalt()];

    expect(salt1).to.not.deep.equal(salt2);
    expect(salt1).to.not.deep.equal(salt3);
    expect(salt2).to.not.deep.equal(salt3);
  });
});

describe("the encodePassword function works correctly", () => {
  it("combines the salt & password and returns them as a buffer", () => {
    const [password, salt] = ["password", "salt"];
    const encodedPassword = encodePassword(password, salt);
    const encoder = new TextEncoder();
    const buffer = encoder.encode(`${password}${salt}`);

    expect(encodedPassword).to.not.deep.equal(`${password}${salt}`);
    expect(encodedPassword).to.deep.equal(buffer);
  });
});

describe("the decodeHash function works correctly", () => {
  it("always returns a 129 character string", async () => {
    const [password1, password2, password3] = [
      decodeHash(await generateHash(encodePassword("password1", "salt1"))),
      decodeHash(
        await generateHash(
          encodePassword(
            "skdfnlksdfsdjflksdjflksdjflksdjflksdjflksdjflkjsdflksdjflksjdlfkjsdlkfjlskdjflksdjflskdjf",
            "salt2"
          )
        )
      ),
      decodeHash(await generateHash(encodePassword("", "salt3"))),
    ];

    expect(password1).toHaveLength(128);
    expect(password2).toHaveLength(128);
    expect(password3).toHaveLength(128);
  });

  it("generates an identical hash given identical inputs", async () => {
    const [identicalPassword1, identicalPassword2, password] = [
      decodeHash(await generateHash(encodePassword("password", "salt"))),
      decodeHash(await generateHash(encodePassword("password", "salt"))),
      decodeHash(await generateHash(encodePassword("password", "salt3"))),
    ];

    expect(identicalPassword1).to.deep.equal(identicalPassword2);
    expect(password).to.not.deep.equal(identicalPassword1);
  });
});
