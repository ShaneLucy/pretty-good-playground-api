import { convertPlainTextToPasswordHash, generateJWT } from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import { HttpStatusCodes, LoggingMessages } from "../../utilities";

const loginHandler = async (
  userAuthenticationData: UserAuthenticationData,
  kvNamespace: KVNamespace,
  jwtSecret: string
): Promise<ResponseData> => {
  const { username: providedUsername, password: providedPassword } = userAuthenticationData;
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return {
      message: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  const user = await kvNamespace.get(providedUsername);
  if (user === null) {
    return {
      message: LoggingMessages.USER_NOT_FOUND,
      code: HttpStatusCodes.NOT_FOUND,
    };
  }

  const userCredentials: UserCredentials = JSON.parse(user);
  const {
    username: userCredentialsUsername,
    salt: userCredentialsSalt,
    password: userCredentialsPassword,
  } = userCredentials;

  const hashedPassword = await convertPlainTextToPasswordHash(
    providedPassword,
    userCredentialsSalt
  );

  if (hashedPassword !== userCredentialsPassword) {
    return {
      message: LoggingMessages.INCORRECT_CREDENTIALS,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  return {
    message: await generateJWT(userCredentialsUsername, jwtSecret),
    code: HttpStatusCodes.SUCCESS,
  };
};

export default loginHandler;
