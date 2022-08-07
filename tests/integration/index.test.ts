import { describe, it, beforeAll, afterAll } from "vitest";
import { ChildProcessWithoutNullStreams } from "child_process";

import { testServer } from "../test-utils";

import {
  deleteUserRequestWithValidUsername,
  deleteUserWithUsernameNotInSystem,
  deleteUserWithMismatchedAuthToken,
  registerRequestWithInvalidPassword,
  registerRequestWithInvalidUsername,
  registerRequestWithValidData,
  loginRequestWithInvalidPassword,
  loginRequestWithInvalidUsername,
  loginRequestWithValidData,
  loginRequestWithoutAnyCredentials,
  loginRequestWithUsernameInSystemButIncorrectPassword,
  loginRequestWithUsernameNotInSystemButWithAUsersPassword,
  unauthorisedRequestForQuestion,
  authorisedRequestForQuestion,
  requestForSecondQuestionOutOfBounds,
  authorisedRequestForAnswer,
  authorisedRequestForAnswerIncorrectData,
  requestForSecondAnswerOutOfBounds,
  authorisedRequestForSecondAnswer,
  authorisedRequestForSecondQuestion,
  unauthorisedRequestForAnswer,
  requestForThirdAnswerOutOfBounds,
  requestForThirdQuestionOutOfBounds,
} from "./index";

let server: ChildProcessWithoutNullStreams;

beforeAll(async () => {
  server = await testServer();
});

afterAll(() => {
  server.kill("SIGINT");
});

describe("unauthenticated users cannot request questions or answers", () => {
  it("returns the correct message and status", unauthorisedRequestForQuestion);
  it("returns the correct message and status", unauthorisedRequestForAnswer);
});

describe("the register routes work correctly", () => {
  it(
    "given valid user credentials, returns the correct message and status",
    registerRequestWithValidData
  );
  it(
    "given a valid username but invalid password, returns the correct error message and status",
    registerRequestWithInvalidPassword
  );
  it(
    "given an invalid username but valid password, returns the correct error message and status",
    registerRequestWithInvalidUsername
  );
});

describe("the login routes work correctly", () => {
  it(`given valid user credentials, returns a valid JSON token`, loginRequestWithValidData);

  it(
    `given an invalid username with a valid password, returns the correct error message and status`,
    loginRequestWithInvalidUsername
  );

  it(
    `given a valid username with an invalid password, returns the correct error message and status`,
    loginRequestWithInvalidPassword
  );

  it(
    `given a request without a username or password, returns the correct error message and status`,
    loginRequestWithoutAnyCredentials
  );

  it(
    `given a request with a username that doesn't exist and a password that is used by a user,
    returns the correct error message and status`,
    loginRequestWithUsernameNotInSystemButWithAUsersPassword
  );

  it(
    `given a request with a username that exists but an invalid password for this user,
      returns the correct error message and status`,
    loginRequestWithUsernameInSystemButIncorrectPassword
  );
});

describe("the game routes work correctly for a user who is logged in", () => {
  it(
    "returns the correct message and status when requesting an answer the user isn't authorised to view",
    requestForSecondAnswerOutOfBounds
  );
  it(
    "returns the correct message and status when requesting a question the user isn't authorised to view",
    requestForSecondQuestionOutOfBounds
  );
  it(
    "returns the question text when a user requests a question they are authorised to view",
    authorisedRequestForQuestion
  );
  it(
    "returns the correct message and status when providing an incorrect answer",
    authorisedRequestForAnswerIncorrectData
  );
  it(
    "returns the answer text and updated access token when a user requests an answer they are authorised to view",
    authorisedRequestForAnswer
  );
  it(
    "after successfully answering the first question, does not have access to the third question",
    requestForThirdQuestionOutOfBounds
  );
  it(
    "after successfully answering the first question, does not have access to the third answer",
    requestForThirdAnswerOutOfBounds
  );
  it(
    "after successfully answering the first question, has access to the second question",
    authorisedRequestForSecondQuestion
  );
  it(
    "after successfully answering the first question, has access to the second answer",
    authorisedRequestForSecondAnswer
  );
});

describe("the delete user route works correctly", () => {
  it("given a valid username it deletes the requested user", deleteUserRequestWithValidUsername);
  it(
    "given a username that doesn't exist in the system, returns the correct error status and message",
    deleteUserWithUsernameNotInSystem
  );
  it(
    "given a mismatched jwt it fails to delete the specified resource, then when supplied with the correct jwt deletes the resource",
    deleteUserWithMismatchedAuthToken
  );
});
