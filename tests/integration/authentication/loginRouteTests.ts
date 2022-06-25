import { expect } from "vitest";
import { decodeJwt } from "jose";

import { baseUrlConfig, fetchWrapper, validUsername, validPassword } from "../../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/authentication/login`;

export const loginRequestWithValidData = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: validPassword,
  });

  const responseData = (await result.json()) as LoginResponseBody;
  if (!(responseData instanceof Object)) {
    throw new TypeError("");
  }

  const jwt = decodeJwt(responseData.authToken);

  expect(result.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(jwt?.uuid).to.be.deep.equal(responseData.uuid);
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
