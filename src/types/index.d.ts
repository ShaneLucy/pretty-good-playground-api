type StoredUserCredentials = {
  username: string;
  password: string;
  salt: string;
  uuid: string;
};

type UserAuthenticationData = Pick<StoredUserCredentials, "username" | "password">;

type Env = {
  USERS: KVNamespace;
  JWT_SECRET: string;
  ALLOWED_ORIGIN: string;
};

type ResponseData = {
  body:
    | string
    | {
        authToken: string;
        username: string;
        uuid: string;
      };
  code: number;
  accessControl: string;
};

type FetchResponseData =
  | {
      authToken: string;
      username: string;
      uuid: string;
    }
  | string;

type RequestMethodTypes = "GET" | "POST";

interface IRequest extends Request {
  method: RequestMethodTypes;
  url: string;
  optional?: string;
}
