import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig, validUsername } from "../../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/users/${validUsername}/answers`;

export const unauthorisedRequestForAnswer = async () => {
  let res;
  try {
    await axios.post(`${requestUrl}/1`, {});
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};

export const authorisedRequestForAnswer = async () => {
  const response = await axios.post(`${requestUrl}/1`, { answer: "answer1" });

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal("answer1");
};

export const authorisedRequestForAnswerIncorrectData = async () => {
  let res;
  try {
    await axios.post(`${requestUrl}/1`, { answer: "answer" });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal("The answer you provided was incorrect");
};

export const requestForAnswerOutOfBounds = async () => {
  let res;
  try {
    await axios.post(`${requestUrl}/2`, { answer: "asdk" });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNAUTHORISED);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.UNAUTHORISED);
};
