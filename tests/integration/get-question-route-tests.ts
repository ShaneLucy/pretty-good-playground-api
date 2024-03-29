import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig, validUsername } from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const validUrl = `${baseUrlConfig.baseUrl}/users/${validUsername}/questions`;

export const unauthorisedRequestForQuestion = async () => {
  let res;
  try {
    await axios.get(`${validUrl}/1`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const authorisedRequestForQuestion = async () => {
  const response = await axios.get(`${validUrl}/1`);

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal("question 1");
};

export const authorisedRequestForSecondQuestion = async () => {
  const response = await axios.get(`${validUrl}/2`);

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal("question 2");
};

export const requestForSecondQuestionOutOfBounds = async () => {
  let res;
  try {
    await axios.get(`${validUrl}/2`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const requestForThirdQuestionOutOfBounds = async () => {
  let res;
  try {
    await axios.get(`${validUrl}/3`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};
