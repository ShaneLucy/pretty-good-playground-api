import { convertPlainTextToPasswordHash, generateJWT } from "../authentication";
import { validateUser } from "../validation";
import { HttpStatusCodes, ResponseMessages, responseBuilder, Audience } from "../utilities";
import type { CustomRequest } from "../types/custom";

const loginHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const { username, password } = (await request.json()) as UserAuthenticationData;

  const isUserValid = validateUser({ username, password });
  if (!isUserValid.isValid) {
    return responseBuilder({
      body: isUserValid.errorMessage,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const user = await env.USERS.get(username);
  if (user === null) {
    return responseBuilder({
      body: ResponseMessages.USER_NOT_FOUND,
      status: HttpStatusCodes.NOT_FOUND,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const {
    salt: userModelSalt,
    password: userModelPassword,
    questionId: userModelQuestionId,
  } = JSON.parse(user) as UserModel;

  const hashedPassword = await convertPlainTextToPasswordHash(password, userModelSalt);

  if (hashedPassword !== userModelPassword) {
    return responseBuilder({
      body: ResponseMessages.INCORRECT_CREDENTIALS,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  return responseBuilder({
    body: {
      username,
      authToken: await generateJWT(
        { username, questionId: parseInt(userModelQuestionId, 10) },
        env.JWT_SECRET,
        env.JWT_DURATION_HOURS,
        Audience.ALL
      ),
      questionId: parseInt(userModelQuestionId, 10),
    },
    status: HttpStatusCodes.SUCCESS,
    accessControl: env.ALLOWED_ORIGIN,
  });
};

export default loginHandler;
