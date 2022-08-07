import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig, validUsername } from "../../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/users/${validUsername}/questions`;

export const unauthorisedRequestForQuestion = async () => {
  let res;
  try {
    await axios.get(`${requestUrl}/1`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const authorisedRequestForQuestion = async () => {
  const response = await axios.get(`${requestUrl}/1`);

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal("question 1");
};

export const requestForQuestionOutOfBounds = async () => {
  let res;
  try {
    await axios.get(`${requestUrl}/2`);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};
