import { generateSalt, convertPlainTextToPasswordHash } from "../../authentication";
import { validateUser } from "../../validation";
import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../../utilities";
import type { CustomRequest } from "../../types/custom";

const registrationHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const [{ username, password }, kvNamespace, accessControl] = [
    (await request.json()) as UserAuthenticationData,
    env.USERS,
    env.ALLOWED_ORIGIN,
  ];
  const isUserValid = validateUser({ username, password });
  if (!isUserValid.isValid) {
    return responseBuilder({
      body: isUserValid.errorMessage,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    });
  }

  if ((await kvNamespace.get(username)) !== null) {
    return responseBuilder({
      body: ResponseMessages.USER_EXISTS,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    });
  }

  const salt = generateSalt();
  const hashedPassword = await convertPlainTextToPasswordHash(password, salt);

  const userCredentialsToStore: UserModelValue = {
    salt,
    password: hashedPassword,
    questionId: "1",
  };

  await kvNamespace.put(username, JSON.stringify(userCredentialsToStore));

  return responseBuilder({
    body: ResponseMessages.SUCCESS,
    status: HttpStatusCodes.SUCCESS,
    accessControl,
  });
};

export default registrationHandler;
