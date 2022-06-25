import { convertPlainTextToPasswordHash, generateJWT } from "../../authentication";
import { validateUser } from "../../validation";
import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../../utilities";
import type { CustomRequest } from "../../types/custom";

const loginHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const [userAuthenticationData, kvNamespace, jwtSecret, accessControl, jwtDuraionHours] = [
    (await request.json()) as UserAuthenticationData,
    env.USERS,
    env.JWT_SECRET,
    env.ALLOWED_ORIGIN,
    env.JWT_DURATION_HOURS,
  ];

  const { username: providedUsername, password: providedPassword } = userAuthenticationData;
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return responseBuilder({
      body: isUserValid.errorMessage,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    });
  }

  const user = await kvNamespace.get(providedUsername);
  if (user === null) {
    return responseBuilder({
      body: ResponseMessages.USER_NOT_FOUND,
      status: HttpStatusCodes.NOT_FOUND,
      accessControl,
    });
  }

  const storedUserCredentials: StoredUserCredentials = JSON.parse(user);
  const {
    username: storedUserCredentialsUsername,
    salt: storedUserCredentialsSalt,
    password: storedUserCredentialsPassword,
    uuid: storedUserCredentialsUuid,
  } = storedUserCredentials;

  const hashedPassword = await convertPlainTextToPasswordHash(
    providedPassword,
    storedUserCredentialsSalt
  );

  if (hashedPassword !== storedUserCredentialsPassword) {
    return responseBuilder({
      body: ResponseMessages.INCORRECT_CREDENTIALS,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    });
  }

  return responseBuilder({
    body: {
      authToken: await generateJWT(storedUserCredentialsUuid, jwtSecret, jwtDuraionHours),
      username: storedUserCredentialsUsername,
      uuid: storedUserCredentialsUuid,
    },
    status: HttpStatusCodes.SUCCESS,
    accessControl,
  });
};

export default loginHandler;
