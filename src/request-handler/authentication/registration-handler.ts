import { generateSalt, convertPlainTextToPasswordHash } from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import { HttpStatusCodes, LoggingMessages } from "../../utilities";

const registrationHandler = async (
  userAuthenticationData: UserAuthenticationData,
  kvNamespace: KVNamespace
): Promise<ResponseData> => {
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return {
      message: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  if ((await kvNamespace.get(userAuthenticationData.username)) !== null) {
    return {
      message: LoggingMessages.USER_EXISTS,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  const salt = generateSalt();
  const hashedPassword = await convertPlainTextToPasswordHash(
    userAuthenticationData.password,
    salt
  );

  await kvNamespace.put(
    userAuthenticationData.username,
    JSON.stringify({ username: userAuthenticationData.username, salt, password: hashedPassword })
  );

  return {
    message: LoggingMessages.SUCCESS,
    code: HttpStatusCodes.SUCCESS,
  };
};

export default registrationHandler;
