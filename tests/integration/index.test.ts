import { describe, it, beforeAll, afterAll } from "vitest";
import { ChildProcessWithoutNullStreams } from "child_process";

import { testServer } from "../test-utils";

import {
  loginRequestWithInvalidPassword,
  loginRequestWithInvalidUsername,
  loginRequestWithUsernameInSystemButIncorrectPassword,
  loginRequestWithUsernameNotInSystemButWithAUsersPassword,
  loginRequestWithValidData,
  loginRequestWithoutAnyCredentials,
} from "./login-route-tests";

import {
  registerRequestWithInvalidPassword,
  registerRequestWithInvalidUsername,
  registerRequestWithValidData,
} from "./register-route-tests";
import {
  deleteUserRequestWithValidUsername,
  deleteUserWithMismatchedAuthToken,
  deleteUserWithUsernameNotInSystem,
} from "./delete-user-route-tests";
import {
  authorisedRequestForQuestion,
  unauthorisedRequestForQuestion,
  requestForSecondQuestionOutOfBounds,
  requestForThirdQuestionOutOfBounds,
  authorisedRequestForSecondQuestion,
} from "./get-question-route-tests";
import {
  unauthorisedRequestForAnswer,
  authorisedRequestForAnswer,
  authorisedRequestForAnswerIncorrectData,
  authorisedRequestForSecondAnswer,
  requestForSecondAnswerOutOfBounds,
  requestForThirdAnswerOutOfBounds,
} from "./post-answer-route-tests";
import {
  getRequestForMissingRoute,
  postRequestForMissingRoute,
  deleteRequestForMissingRoute,
} from "./missing-route-test";
import { updatePassword, updatePasswordWithInvalidData } from "./patch-user-password-route-tests";
import { updatePublicKey, updatePublicKeyWithInvalidData } from "./patch-user-public-key-route";
import {
  authorisedRequestForUser,
  unauthorisedRequestForDifferentUser,
  unauthorisedRequestForUser,
} from "./get-user-route-test";

let server: ChildProcessWithoutNullStreams;

beforeAll(async () => {
  server = await testServer();
});

afterAll(() => {
  server.kill("SIGINT");
});

describe("the missing route handler works correctly", () => {
  it("returns the correct status and message for a get request", getRequestForMissingRoute);
  it("returns the correct status and message for a post request", postRequestForMissingRoute);
  it("returns the correct status and message for a delete request", deleteRequestForMissingRoute);
});

describe("unauthenticated users cannot request questions or answers", () => {
  it("returns the correct message and status", unauthorisedRequestForQuestion);
  it("returns the correct message and status", unauthorisedRequestForAnswer);
});

describe("unauthenticated users cannot request user details", () => {
  it("returns the correct message and status", unauthorisedRequestForUser);
  it("returns the correct message and status", unauthorisedRequestForDifferentUser);
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

describe("the get user routes work correctly", () => {
  it(
    "when the authenticated user requests their details, returns a valid response",
    authorisedRequestForUser
  );
  it(
    "when the authenticated user requests a different users details, returns the correct error response",
    unauthorisedRequestForDifferentUser
  );
});

describe("the patch user password route works correctly", () => {
  it("given a valid password, updates the password", updatePassword);

  it(
    "given an invalid password, returns the correct error status and message",
    updatePasswordWithInvalidData
  );
});

describe("the patch user public key route works correctly", () => {
  it("given a valid public key, updates the public key", updatePublicKey);
  it(
    "given an invalid public key, returns the correct error status and message",
    updatePublicKeyWithInvalidData
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
  it("given a valid username, deletes the requested user", deleteUserRequestWithValidUsername);
  it(
    "given a username that doesn't exist in the system, returns the correct error status and message",
    deleteUserWithUsernameNotInSystem
  );
  it(
    "given a mismatched jwt, fails to delete the specified resource, then when supplied with the correct jwt deletes the resource",
    deleteUserWithMismatchedAuthToken
  );
});
