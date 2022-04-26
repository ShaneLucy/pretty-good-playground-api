import {
  generateSalt,
  encodePassword,
  convertHashToHexString,
  generateHash,
} from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";

const registrationHandler = async (
  request: Request,
  kvNamespace: KVNamespace
): Promise<Response> => {
  const { username, password } = await request.json();

  const isUserValid = validateUser(username, password);
  if (!isUserValid.isValid) {
    return new Response(JSON.stringify({ error: isUserValid.errorMessage }), {
      headers: {
        "Content-type": "application/json",
      },
      status: 422,
      statusText: isUserValid.errorMessage,
    });
  }

  if ((await kvNamespace.get(username)) !== null) {
    const errorText = "Username already exists";
    return new Response(JSON.stringify({ error: errorText }), {
      headers: {
        "Content-type": "application/json",
      },
      status: 422,
      statusText: errorText,
    });
  }

  const salt = generateSalt();
  const encodedPassword = encodePassword(password, salt);
  const hashedPassword = convertHashToHexString(await generateHash(encodedPassword));

  const response = kvNamespace.put(
    username,
    JSON.stringify({ username, password: hashedPassword, salt })
  );

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-type": "application/json",
    },
  });
};

export default registrationHandler;
