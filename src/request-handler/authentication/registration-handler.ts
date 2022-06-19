import { generateSalt, convertPlainTextToPasswordHash } from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import { HttpStatusCodes, ResponseMessages } from "../../utilities";

const registrationHandler = async (
  userAuthenticationData: UserAuthenticationData,
  kvNamespace: KVNamespace
): Promise<ResponseData> => {
  const isUserValid = validateUser(userAuthenticationData);
  if (!isUserValid.isValid) {
    return {
      body: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  if ((await kvNamespace.get(userAuthenticationData.username)) !== null) {
    return {
      body: ResponseMessages.USER_EXISTS,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
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

  return {
    body: ResponseMessages.SUCCESS,
    code: HttpStatusCodes.SUCCESS,
  };
};

export default registrationHandler;
