import { expect } from "vitest";

import { baseUrlConfig, fetchWrapper, validUsername, validPassword } from "../../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/authentication/register`;

export const registerRequestWithValidData = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.SUCCESS);
};

export const registerRequestWithInvalidUsername = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: "",
    password: validPassword,
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.USERNAME_EMPTY);
};

export const registerRequestWithInvalidPassword = async () => {
  const result = await fetchWrapper(requestUrl, "POST", {
    username: validUsername,
    password: "",
  });

  expect(result.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(await result.json()).to.be.deep.equal(ResponseMessages.PASSWORD_EMPTY);
};
