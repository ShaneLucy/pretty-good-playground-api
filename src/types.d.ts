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
