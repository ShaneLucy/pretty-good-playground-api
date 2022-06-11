import { expect } from "vitest";
import { decodeJwt } from "jose";

import { baseUrlConfig, fetchWrapper } from "../../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

const validUsername = "oewjkdofj";
const validPassword = "password1";
const requestUrl = `${baseUrlConfig.baseUrl}/authentication/login`;

export const loginRequestWithValidData = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: validPassword,
  });
  const jwt = decodeJwt(await result.text());

  expect(result.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(jwt?.username).to.be.deep.equal(validUsername);
};

export const loginRequestWithUsernameNotInSystemButWithAUsersPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: "validUsername",
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.USER_NOT_FOUND);
};

export const loginRequestWithUsernameInSystemButIncorrectPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: "validPassword",
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.INCORRECT_CREDENTIALS);
};

export const loginRequestWithInvalidUsername = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: "",
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.USERNAME_EMPTY);
};

export const loginRequestWithInvalidPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: "",
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.PASSWORD_EMPTY);
};

export const loginRequestWithoutAnyCredentials = async () => {
  const result = await fetchWrapper(requestUrl, "POST", { username: "", password: "" });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.USERNAME_EMPTY);
};
