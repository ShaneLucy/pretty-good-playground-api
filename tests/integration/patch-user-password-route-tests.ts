import { expect } from "vitest";
import axios, { AxiosError } from "axios";

import { baseUrlConfig, validPassword, validUsername } from "../test-utils";
import { HttpStatusCodes, ResponseMessages } from "../../src/utilities";

const requestUrl = `${baseUrlConfig.baseUrl}/users/${validUsername}/password`;

export const updatePassword = async () => {
  const newPassword = "94578943w9er";
  const response = await axios.patch(requestUrl, {
    password: newPassword,
  });

  expect(response.status).to.be.deep.equal(HttpStatusCodes.SUCCESS);
  expect(response.data).to.be.deep.equal(ResponseMessages.SUCCESS);

  // TODO once logout route has been implemented, logout here and re authenticate with updated password
};

export const updatePasswordWithInvalidData = async () => {
  let res;
  try {
    await axios.patch(requestUrl, {
      password: "",
    });
  } catch (e) {
    res = e as AxiosError;
  }

  expect(res?.response?.status).to.be.deep.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  expect(res?.response?.data).to.be.deep.equal(ResponseMessages.PASSWORD_EMPTY);
};
