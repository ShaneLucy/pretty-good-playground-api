import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig } from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const validUrl = `${baseUrlConfig.baseUrl}/definitely/not/a/valid/url`;

export const getRequestForMissingRoute = async () => {
  let res;
  try {
    await axios.get(validUrl);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.NOT_FOUND);
};

export const postRequestForMissingRoute = async () => {
  let res;
  try {
    await axios.post(validUrl);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.NOT_FOUND);
};

export const deleteRequestForMissingRoute = async () => {
  let res;
  try {
    await axios.delete(validUrl);
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.NOT_FOUND);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.NOT_FOUND);
};
