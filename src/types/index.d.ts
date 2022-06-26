type UserModel = {
  username: string;
  password: string;
  salt: string;
  uuid: string;
};

type UserAuthenticationData = Pick<UserModel, "username" | "password">;

type UserModelValue = Omit<UserModel, "username">;

type Env = {
  USERS: KVNamespace;
  JWT_SECRET: string;
  ALLOWED_ORIGIN: string;
  JWT_DURATION_HOURS: number;
};

type ResponseData = {
  body: any;
  status: number;
  accessControl: string;
};

type LoginResponseBody = {
  authToken: string;
  username: string;
  uuid: string;
};

type FetchResponseData =
  | {
      authToken: string;
      username: string;
      uuid: string;
    }
  | string;

type RequestMethodTypes = "GET" | "HEAD" | "POST" | "OPTIONS" | "DELETE";

type AccessTokenBody = {
  uuid: string;
  iat: string;
  iss: string;
  aud: string;
  exp: number;
};

type UserParam = {
  username: string;
};
