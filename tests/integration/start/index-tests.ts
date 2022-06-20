import { expect } from "vitest";
import { decodeJwt } from "jose";
import axios, { AxiosError } from "axios";

import { baseUrlConfig } from "../../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/start`;

export const startRouteWithAuthorisationHeader = async () => {
  let res;
  try {
    await axios.get(requestUrl);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.BAD_REQUEST);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.BAD_REQUEST);
};

export const startRouteWithoutAuthorisationHeader = async () => {
  const response = await axios.get(requestUrl);

  axios.defaults.headers.common.Authorization = response.data;

  const jwt = (decodeJwt(response.data) as unknown) as QuestionAccessToken;

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(jwt.payload.questionId).to.be.deep.equal("1");
};
