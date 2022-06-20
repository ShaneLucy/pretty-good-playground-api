import { describe, it, beforeAll, afterAll } from "vitest";
import { ChildProcessWithoutNullStreams, execSync } from "child_process";

import { testServer } from "../test-utils";

import {
  loginRequestWithInvalidPassword,
  loginRequestWithInvalidUsername,
  loginRequestWithValidData,
  loginRequestWithoutAnyCredentials,
  loginRequestWithUsernameInSystemButIncorrectPassword,
  loginRequestWithUsernameNotInSystemButWithAUsersPassword,
} from "./authentication/loginRouteTests";

import {
  registerRequestWithInvalidPassword,
  registerRequestWithInvalidUsername,
  registerRequestWithValidData,
} from "./authentication/registerRouteTests";

let server: ChildProcessWithoutNullStreams;

beforeAll(async () => {
  server = await testServer();
});

afterAll(() => {
  server.kill("SIGINT");

  // kill any straggling wrangler process
  execSync("pidof wrangler | xargs kill");
});

describe("the register routes work correctly", () => {
  // it(
  //   "given valid user credentials, returns the correct response message and code",
  //   registerRequestWithValidData
  // );
  it(
    "given a valid username but invalid password, returns the correct error message and code",
    registerRequestWithInvalidPassword
  );
  it(
    "given an invalid username but valid password, returns the correct error message and code",
    registerRequestWithInvalidUsername
  );
});

describe("the login routes work correctly", () => {
  it(`given valid user credentials, returns a valid JSON token`, loginRequestWithValidData);

  it(
    `given an invalid username with a valid password, returns the correct error message and code`,
    loginRequestWithInvalidUsername
  );

  it(
    `given a valid username with an invalid password, returns the correct error message and code`,
    loginRequestWithInvalidPassword
  );

  it(
    `given a request without a username or password, returns the correct error message and code`,
    loginRequestWithoutAnyCredentials
  );

  it(
    `given a request with a username that doesn't exist and a password that is used by a user, 
    returns the correct error message and code`,
    loginRequestWithUsernameNotInSystemButWithAUsersPassword
  );

  it(
    `given a request with a username that exists but an invalid password for this user, 
      returns the correct error message and code`,
    loginRequestWithUsernameInSystemButIncorrectPassword
  );
});