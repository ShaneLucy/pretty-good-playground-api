import { HttpStatusCodes, ResponseMessages, responseBuilder } from "../../utilities";
import type { CustomRequest } from "../../types/custom";

const deleteUserHandler = async (request: CustomRequest, env: Env): Promise<Response> => {
  const [username, kvNamespace, accessControl] = [
    (await request.json()) as string,
    env.USERS,
    env.ALLOWED_ORIGIN,
  ];

  if (username === null) {
    return responseBuilder({
      body: ResponseMessages.BAD_REQUEST,
      status: HttpStatusCodes.BAD_REQUEST,
      accessControl,
    });
  }

  try {
    const userExists = await kvNamespace.get(username);
    if (userExists === undefined || userExists === null) {
      return responseBuilder({
        body: ResponseMessages.BAD_REQUEST,
        status: HttpStatusCodes.BAD_REQUEST,
        accessControl,
      });
    }

    await kvNamespace.delete(username);
    return responseBuilder({
      body: ResponseMessages.SUCCESS,
      status: HttpStatusCodes.SUCCESS,
      accessControl,
    });
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return responseBuilder({
      body: ResponseMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      accessControl,
    });
  }
};

export default deleteUserHandler;
