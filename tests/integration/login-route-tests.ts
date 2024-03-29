import { expect } from "vitest";
import { decodeJwt } from "jose";
import axios, { AxiosError } from "axios";

import {
  baseUrlConfig,
  validUsername,
  validPassword,
  invalidUsername,
  invalidPassword,
  usernameNotInSystem,
  incorrectPasswordForValidUser,
} from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const validUrl = `${baseUrlConfig.baseUrl}/authentication/login`;

export const loginRequestWithValidData = async () => {
  const response = await axios.post(validUrl, {
    username: validUsername,
    password: validPassword,
  });

  const responseData = response.data as LoginResponseBody;
  axios.defaults.headers.common.Authorization = responseData.authToken;

  const jwt = (decodeJwt(responseData.authToken) as unknown) as AllAudienceAccessToken;

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(jwt.payload.username).to.be.deep.equal(responseData.username);
  expect(jwt.payload.questionId).to.be.deep.equal(responseData.questionId);
};

export const loginRequestWithUsernameNotInSystemButWithAUsersPassword = async () => {
  let res;
  try {
    await axios.post(validUrl, {
      username: usernameNotInSystem,
      password: validPassword,
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.NOT_FOUND);
};

export const loginRequestWithUsernameInSystemButIncorrectPassword = async () => {
  let res;
  try {
    await axios.post(validUrl, {
      username: validUsername,
      password: incorrectPasswordForValidUser,
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.INCORRECT_CREDENTIALS);
};

export const loginRequestWithInvalidUsername = async () => {
  let res;
  try {
    await axios.post(validUrl, {
      username: invalidUsername,
      password: validPassword,
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.USERNAME_EMPTY);
};

export const loginRequestWithInvalidPassword = async () => {
  let res;
  try {
    await axios.post(validUrl, {
      username: validUsername,
      password: invalidPassword,
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.PASSWORD_EMPTY);
};

export const loginRequestWithoutAnyCredentials = async () => {
  let res;
  try {
    await axios.post(validUrl, {
      username: "",
      password: "",
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.USERNAME_EMPTY);
};
