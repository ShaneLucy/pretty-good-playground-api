import { describe, it, expect } from "vitest";

import {
  validateUsername,
  validatePassword,
  validateUser,
} from "../../../src/utilities/validation";
import { LoggingMessages } from "../../../src/utilities";

const [validUsername, validUsername2, validUsername3] = [
  "9021qwIdsad9390",
  "$$^*$&^$&*^$*&$^$",
  "i",
];

const [
  invalidUsername,
  invalidUsername2,
  invalidUsername3,
  invalidUsername4,
  invalidUsername5,
  invalidUsername6,
] = ["", " ", " i", "i ", "i i", "\n"];

const [validPassword, validPassword2, validPassword3] = [
  "@~@~@239090ird'asd.?CX.z/dfp[-o23-o",
  "12345678",
  " 123 567 ",
];

const [invalidPassword, invalidPassword2] = ["", "1234567"];

describe("the validateUsername function works correctly", () => {
  it("accepts a valid username", () => {
    const [isValid, isValid2, isValid3] = [
      validateUsername(validUsername),
      validateUsername(validUsername2),
      validateUsername(validUsername3),
    ];

    expect(isValid.isValid).to.deep.equal(true);
    expect(isValid.errorMessage).to.have.lengthOf(0);

    expect(isValid2.isValid).to.deep.equal(true);
    expect(isValid2.errorMessage).to.have.lengthOf(0);

    expect(isValid3.isValid).to.deep.equal(true);
    expect(isValid3.errorMessage).to.have.lengthOf(0);
  });

  it("rejects invalid usernames", () => {
    const [isInvalid, isInvalid2, isInvalid3, isInvalid4, isInvalid5, isInvalid6] = [
      validateUsername(invalidUsername),
      validateUsername(invalidUsername2),
      validateUsername(invalidUsername3),
      validateUsername(invalidUsername4),
      validateUsername(invalidUsername5),
      validateUsername(invalidUsername6),
    ];

    expect(isInvalid.isValid).to.deep.equal(false);
    expect(isInvalid.errorMessage).to.deep.equal(LoggingMessages.USERNAME_EMPTY);

    expect(isInvalid2.isValid).to.deep.equal(false);
    expect(isInvalid2.errorMessage).to.deep.equal(LoggingMessages.USERNAME_MALFORMED);

    expect(isInvalid3.isValid).to.deep.equal(false);
    expect(isInvalid3.errorMessage).to.deep.equal(LoggingMessages.USERNAME_MALFORMED);

    expect(isInvalid4.isValid).to.deep.equal(false);
    expect(isInvalid4.errorMessage).to.deep.equal(LoggingMessages.USERNAME_MALFORMED);

    expect(isInvalid5.isValid).to.deep.equal(false);
    expect(isInvalid5.errorMessage).to.deep.equal(LoggingMessages.USERNAME_MALFORMED);

    expect(isInvalid6.isValid).to.deep.equal(false);
    expect(isInvalid6.errorMessage).to.deep.equal(LoggingMessages.USERNAME_MALFORMED);
  });
});

describe("the validatePassword function works correctly", () => {
  it("accepts valid passwords", () => {
    const [isValid, isValid2, isValid3] = [
      validatePassword(validPassword),
      validatePassword(validPassword2),
      validatePassword(validPassword3),
    ];

    expect(isValid.isValid).to.deep.equal(true);
    expect(isValid.errorMessage).to.have.lengthOf(0);

    expect(isValid2.isValid).to.deep.equal(true);
    expect(isValid2.errorMessage).to.have.lengthOf(0);

    expect(isValid3.isValid).to.deep.equal(true);
    expect(isValid3.errorMessage).to.have.lengthOf(0);
  });

  it("rejects invalid passwords", () => {
    const [isInvalid, isInvalid2] = [
      validatePassword(invalidPassword),
      validatePassword(invalidPassword2),
    ];

    expect(isInvalid.isValid).to.deep.equal(false);
    expect(isInvalid.errorMessage).to.deep.equal(LoggingMessages.PASSWORD_EMPTY);

    expect(isInvalid2.isValid).to.deep.equal(false);
    expect(isInvalid2.errorMessage).to.deep.equal(LoggingMessages.PASSWORD_INVALID);
  });
});

describe("the validateUser function works correctly", () => {
  it("accepts a valid username and password", () => {
    const [isValid, isValid2, isValid3] = [
      validateUser(validUsername, validPassword),
      validateUser(validUsername2, validPassword2),
      validateUser(validUsername3, validPassword3),
    ];

    expect(isValid.isValid).to.deep.equal(true);
    expect(isValid.errorMessage).to.have.lengthOf(0);

    expect(isValid2.isValid).to.deep.equal(true);
    expect(isValid2.errorMessage).to.have.lengthOf(0);

    expect(isValid3.isValid).to.deep.equal(true);
    expect(isValid3.errorMessage).to.have.lengthOf(0);
  });

  it("rejects invalid usernames and passwords", () => {
    const [isInvalid, isInvalid2, isInvalid3] = [
      validateUser(invalidUsername, invalidPassword),
      validateUser(validUsername3, invalidPassword),
      validateUser(invalidUsername4, validPassword),
    ];

    expect(isInvalid.isValid).to.deep.equal(false);
    expect(isInvalid.errorMessage).to.deep.equal(LoggingMessages.USERNAME_EMPTY);

    expect(isInvalid2.isValid).to.deep.equal(false);
    expect(isInvalid2.errorMessage).to.deep.equal(LoggingMessages.PASSWORD_EMPTY);

    expect(isInvalid3.isValid).to.deep.equal(false);
    expect(isInvalid3.errorMessage).to.deep.equal(LoggingMessages.USERNAME_MALFORMED);
  });
});
