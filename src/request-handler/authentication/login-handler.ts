import { convertPlainTextToPasswordHash, generateJWT } from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import { HttpStatusCodes, ResponseMessages } from "../../utilities";

const loginHandler = async (
  userAuthenticationData: UserAuthenticationData,
  kvNamespace: KVNamespace,
  jwtSecret: string
): Promise<ResponseData> => {
  const { username: providedUsername, password: providedPassword } = userAuthenticationData;
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return {
      body: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  const user = await kvNamespace.get(providedUsername);
  if (user === null) {
    return {
      body: ResponseMessages.USER_NOT_FOUND,
      code: HttpStatusCodes.NOT_FOUND,
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
    };
  }

  return {
    body: {
      authToken: await generateJWT(storedUserCredentialsUsername, jwtSecret),
      username: storedUserCredentialsUsername,
      uuid: storedUserCredentialsUuid,
    },
    code: HttpStatusCodes.SUCCESS,
  };
};

export default loginHandler;
