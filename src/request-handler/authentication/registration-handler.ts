import { generateSalt, convertPlainTextToPasswordHash } from "../../authentication";
import { validateUser } from "../../validation";
import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../../utilities";
import type { CustomRequest } from "../../types/custom";

const registrationHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const [userAuthenticationData, kvNamespace, accessControl] = [
    (await request.json()) as UserAuthenticationData,
    env.USERS,
    env.ALLOWED_ORIGIN,
  ];
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return responseBuilder({
      body: isUserValid.errorMessage,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    });
  }

  if ((await kvNamespace.get(userAuthenticationData.username)) !== null) {
    return responseBuilder({
      body: ResponseMessages.USER_EXISTS,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    });
  }

  const [salt, uuid] = [generateSalt(), generateSalt()];
  const hashedPassword = await convertPlainTextToPasswordHash(
    userAuthenticationData.password,
    salt
  );

  const userCredentialsToStore: StoredUserCredentials = {
    username: userAuthenticationData.username,
    password: hashedPassword,
    salt,
    uuid,
  };

  await kvNamespace.put(userAuthenticationData.username, JSON.stringify(userCredentialsToStore));

  return responseBuilder({
    body: ResponseMessages.SUCCESS,
    status: HttpStatusCodes.SUCCESS,
    accessControl,
  });
};

export default registrationHandler;
