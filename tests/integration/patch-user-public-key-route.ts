import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig, validPublicKey, validUsername } from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/users/${validUsername}/public-key`;

export const updatePublicKey = async () => {
  const response = await axios.patch(requestUrl, {
    publicKey: validPublicKey,
  });

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal(ResponseMessages.SUCCESS);
};

export const updatePublicKeyWithInvalidData = async () => {
  let res;
  try {
    await axios.patch(requestUrl, {
      publicKey: "",
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal("Misformed armored text");
};
