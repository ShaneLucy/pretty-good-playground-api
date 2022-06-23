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

type RequestMethodTypes = "GET" | "POST" | "DELETE";

type AccessTokenBody = {
  uuid: string;
  iat: string;
  iss: string;
  aud: string;
  exp: number;
};

type UuidParam = {
  uuid: string;
};
