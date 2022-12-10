import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import {
  baseUrlConfig,
  validUsername,
  usernameNotInSystem,
  validUsername2,
  validPassword,
} from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const validUrl = `${baseUrlConfig.baseUrl}/users`;

export const deleteUserRequestWithValidUsername = async () => {
  const response = await axios.delete(`${validUrl}/${validUsername}`);

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal(ResponseMessages.SUCCESS);
};

export const deleteUserWithUsernameNotInSystem = async () => {
  let res;
  try {
    await axios.delete(`${validUrl}/${usernameNotInSystem}`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const deleteUserWithMismatchedAuthToken = async () => {
  await axios.post(`${baseUrlConfig.baseUrl}/authentication/register`, {
    username: validUsername2,
    password: validPassword,
  });

  const secondUserLogin = await axios.post(`${baseUrlConfig.baseUrl}/authentication/login`, {
    username: validUsername2,
    password: validPassword,
  });

  const secondUserLoginData = secondUserLogin?.data as LoginResponseBody;

  let failedDeletion;
  try {
    await axios.delete(`${validUrl}/${validUsername2}`);
  } catch (e) {
    failedDeletion = e as AxiosError;
  }

  const successfulDeletion = await axios.delete(`${validUrl}/${validUsername2}`, {
    headers: {
      Authorization: secondUserLoginData.authToken,
    },
  });

  expect(failedDeletion?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(failedDeletion?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
  expect(successfulDeletion?.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(successfulDeletion?.data).to.be.deep.equal(ResponseMessages.SUCCESS);
};
