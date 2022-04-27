import {
  encodePassword,
  convertHashToHexString,
  generateHash,
} from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import generateJWT from "../../utilities/authentication/jwt";
import { HttpStatusCodes, LoggingMessages } from "../../utilities";

type Response = {
  message: string;
  jwt?: string;
  code: number;
};

const loginHandler = async (
  userDetails: { username: string; password: string },
  kvNamespace: KVNamespace,
  jwtSecret: string
): Promise<Response> => {
  const { username, password } = userDetails;

  const isUserValid = validateUser(username, password);
  if (!isUserValid.isValid) {
    return {
      message: isUserValid.errorMessage,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  const user = await kvNamespace.get(username);
  if (user === null) {
    return {
      message: LoggingMessages.USER_NOT_FOUND,
      code: HttpStatusCodes.NOT_FOUND,
    };
  }

  const parsedUser: User = JSON.parse(user);
  const { username: parsedUsername, salt: parsedSalt, password: parsedPassword } = parsedUser;
  const encodedPassword = encodePassword(password, parsedSalt);
  const hashedPassword = convertHashToHexString(await generateHash(encodedPassword));

  if (hashedPassword !== parsedPassword) {
    return {
      message: LoggingMessages.INCORRECT_CREDENTIALS,
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  return {
    message: LoggingMessages.SUCCESS,
    jwt: await generateJWT(parsedUsername, jwtSecret),
    code: HttpStatusCodes.SUCCESS,
  };
};

export default loginHandler;
