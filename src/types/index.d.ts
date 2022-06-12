type StoredUserCredentials = {
  username: string;
  password: string;
  salt: string;
};

type UserAuthenticationData = Pick<StoredUserCredentials, "username" | "password">;

type Env = {
  USERS: KVNamespace;
  JWT_SECRET: string;
};

type ResponseData = {
  message: string;
  code: number;
};

type RequestMethodTypes = "GET" | "POST";

interface IRequest extends Request {
  method: RequestMethodTypes;
  url: string;
  optional?: string;
}
