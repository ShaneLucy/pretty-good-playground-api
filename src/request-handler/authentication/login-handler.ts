import { convertPlainTextToPasswordHash, generateJWT } from "../../authentication";
import { validateUser } from "../../validation";
import { HttpStatusCodes, ResponseMessages } from "../../utilities";

const loginHandler = async (
  userAuthenticationData: UserAuthenticationData,
  kvNamespace: KVNamespace,
  jwtSecret: string,
  accessControl: string
): Promise<ResponseData> => {
  const { username: providedUsername, password: providedPassword } = userAuthenticationData;
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return {
      body: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    };
  }

  const user = await kvNamespace.get(providedUsername);
  if (user === null) {
    return {
      body: ResponseMessages.USER_NOT_FOUND,
      code: HttpStatusCodes.NOT_FOUND,
      accessControl,
    };
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
    return {
      body: ResponseMessages.INCORRECT_CREDENTIALS,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl,
    };
  }

  return {
    body: {
      authToken: await generateJWT(storedUserCredentialsUuid, jwtSecret),
      username: storedUserCredentialsUsername,
      uuid: storedUserCredentialsUuid,
    },
    code: HttpStatusCodes.SUCCESS,
    accessControl,
  };
};

export default loginHandler;
