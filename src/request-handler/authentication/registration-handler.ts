import {
  generateSalt,
  encodePassword,
  convertHashToHexString,
  generateHash,
} from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import { HttpStatusCodes, LoggingMessages } from "../../utilities";

type Response = {
  message: string;
  code: number;
};

const registrationHandler = async (
  userDetails: { username: string; password: string },
  kvNamespace: KVNamespace
): Promise<Response> => {
  const { username, password } = userDetails;

  const isUserValid = validateUser(username, password);
  if (!isUserValid.isValid) {
    return {
      message: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  if ((await kvNamespace.get(username)) !== null) {
    return {
      message: LoggingMessages.USER_EXISTS,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  const salt = generateSalt();
  const encodedPassword = encodePassword(password, salt);
  const hashedPassword = convertHashToHexString(await generateHash(encodedPassword));

  await kvNamespace.put(username, JSON.stringify({ username, salt, password: hashedPassword }));

  return {
    message: LoggingMessages.SUCCESS,
    code: HttpStatusCodes.SUCCESS,
  };
};

export default registrationHandler;
