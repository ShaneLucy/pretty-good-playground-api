import {
  generateSalt,
  encodePassword,
  decodeHash,
  generateHash,
} from "../../utilities/authentication";
import { validateUser } from "../../utilities/validation";
import registerUser from "../../api";

const registrationHandler = async (request: Request): Promise<Response> => {
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

  const salt = generateSalt();
  const encodedPassword = encodePassword(password, salt);
  const hashedPassword = decodeHash(await generateHash(encodedPassword));
  const response = await registerUser(username, hashedPassword, salt);

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-type": "application/json",
    },
  });
};

export default registrationHandler;
