import {
  generateSalt,
  encodePassword,
  convertHashToHexString,
  generateHash,
} from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";

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
      code: 422,
    };
  }

  if ((await kvNamespace.get(username)) !== null) {
    return {
      message: "Username already exists",
      code: 422,
    };
  }

  const salt = generateSalt();
  const encodedPassword = encodePassword(password, salt);
  const hashedPassword = convertHashToHexString(await generateHash(encodedPassword));

  await kvNamespace.put(username, JSON.stringify({ username, password: hashedPassword, salt }));

  return {
    message: "Success",
    code: 200,
  };
};

export default registrationHandler;
