import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig, validUsername, validUsername2 } from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/users/${validUsername}`;

export const unauthorisedRequestForUser = async () => {
  let res;
  try {
    await axios.get(`${requestUrl}`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const unauthorisedRequestForDifferentUser = async () => {
  let res;
  try {
    await axios.get(`${baseUrlConfig.baseUrl}/users/${validUsername2}`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const authorisedRequestForUser = async () => {
  const response = await axios.get(`${requestUrl}`);

  const responseData = response.data as UserModel;

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(responseData.password).to.be.deep.equal(undefined);
  expect(responseData.salt).to.be.deep.equal(undefined);
  expect(responseData.username).to.be.deep.equal(validUsername);
  expect(responseData.questionId).to.be.deep.equal("1");
  expect(responseData.publicKey).to.be.deep.equal(undefined);
};
