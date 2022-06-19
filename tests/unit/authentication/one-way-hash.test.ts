import { TextEncoder } from "util";
import { Crypto } from "@peculiar/webcrypto";

import { describe, it, expect, vi } from "vitest";

import {
  generateHash,
  generateSalt,
  encodePassword,
  convertHashToHexString,
  convertPlainTextToPasswordHash,
} from "../../../src/authentication";

vi.stubGlobal("crypto", new Crypto());

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
    const saltLength = 35;
    const salt = generateSalt();
    expect(salt).toHaveLength(saltLength);
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

describe("the convertHashToHexString function works correctly", () => {
  it("always returns a 129 character string", async () => {
    const passwordLength = 128;
    const [password1, password2, password3] = [
      convertHashToHexString(await generateHash(encodePassword("password1", "salt1"))),
      convertHashToHexString(
        await generateHash(
          encodePassword(
            "skdfnlksdfsdjflksdjflksdjflksdjflksdjflksdjflkjsdflksdjflksjdlfkjsdlkfjlskdjflksdjflskdjf",
            "salt2"
          )
        )
      ),
      convertHashToHexString(await generateHash(encodePassword("", "salt3"))),
    ];

    expect(password1).toHaveLength(passwordLength);
    expect(password2).toHaveLength(passwordLength);
    expect(password3).toHaveLength(passwordLength);
  });

  it("generates an identical hash given identical inputs", async () => {
    const [identicalPassword1, identicalPassword2, password] = [
      convertHashToHexString(await generateHash(encodePassword("password", "salt"))),
      convertHashToHexString(await generateHash(encodePassword("password", "salt"))),
      convertHashToHexString(await generateHash(encodePassword("password", "salt3"))),
    ];

    expect(identicalPassword1).to.deep.equal(identicalPassword2);
    expect(password).to.not.deep.equal(identicalPassword1);
  });
});

describe("the convert plain text to password hash function works correctly", () => {
  it("returns a different value to the combined value of the input parameters", async () => {
    const password = "password";
    const salt = "salt";
    const hashedPassword = await convertPlainTextToPasswordHash(password, salt);

    expect(hashedPassword).to.not.deep.equal(`${password}${salt}`);
  });

  it("given the identical inputs, returns identical outputs", async () => {
    const password = "password";
    const salt = "salt";
    const hashedPassword = await convertPlainTextToPasswordHash(password, salt);
    const hashedPassword2 = await convertPlainTextToPasswordHash(password, salt);
    const hashedPassword3 = await convertPlainTextToPasswordHash(password, salt);

    expect(hashedPassword).to.deep.equal(hashedPassword2);
    expect(hashedPassword).to.deep.equal(hashedPassword3);
  });
});
