import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import {
  baseUrlConfig,
  validUsername,
  validPassword,
  invalidUsername,
  invalidPassword,
} from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const validUrl = `${baseUrlConfig.baseUrl}/authentication/register`;

export const registerRequestWithValidData = async () => {
  const response = await axios.post(validUrl, {
    username: validUsername,
    password: validPassword,
  });

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal(ResponseMessages.SUCCESS);
};

export const registerRequestWithInvalidUsername = async () => {
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

export const registerRequestWithInvalidPassword = async () => {
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
