import { expect } from "vitest";

import { baseUrlConfig, fetchWrapper } from "../test-utils";
import { HttpStatusCodes } from "../../src/utilities";

const validUsername = "oewjkdofj";
const validPassword = "password1";
const requestUrl = `${baseUrlConfig.baseUrl}/authentication/login`;

export const loginRequestWithValidData = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
};

export const loginRequestWithUsernameNotInSystemButWithAUsersPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: "validUsername",
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
};

export const loginRequestWithUsernameInSystemButIncorrectPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: "validPassword",
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
};

export const loginRequestWithInvalidUsername = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: "",
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
};

export const loginRequestWithInvalidPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: "",
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
};

export const loginRequestWithoutAnyCredentials = async () => {
  const result = await fetchWrapper(requestUrl, "POST", { username: "", password: "" });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
};
