import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../utilities";
import { validatePublicKey } from "../validation";
import type { CustomRequest } from "../types/custom";

const patchUserPublicKeyHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const body = (await request.json()) as PublicKeyRequestBody;

  if (body.publicKey === undefined) {
    return responseBuilder({
      body: ResponseMessages.PUBLIC_KEY_EMPTY,
      status: HttpStatusCodes.BAD_REQUEST,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const isPublicKey = await validatePublicKey(body.publicKey);
  if (!isPublicKey.isValid) {
    return responseBuilder({
      body: isPublicKey.errorMessage,
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const { params } = request;
  const param = params as UserParam;
  const user = await env.USERS.get(param?.username);
  if (user === null) {
    return responseBuilder({
      body: ResponseMessages.NOT_FOUND,
      status: HttpStatusCodes.NOT_FOUND,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }

  const updatedUser = (JSON.parse(user) as unknown) as Omit<UserModel, "username">;
  updatedUser.publicKey = body.publicKey;

  try {
    await env.USERS.put(param?.username, JSON.stringify(updatedUser));
    return responseBuilder({
      body: ResponseMessages.SUCCESS,
      status: HttpStatusCodes.SUCCESS,
      accessControl: env.ALLOWED_ORIGIN,
    });
  } catch (e) {
    return responseBuilder({
      body: ResponseMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      accessControl: env.ALLOWED_ORIGIN,
    });
  }
};

export default patchUserPublicKeyHandler;
