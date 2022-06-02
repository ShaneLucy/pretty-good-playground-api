type UserCredentials = {
  username: string;
  password: string;
  salt: string;
};

type UserAuthenticationData = Pick<UserCredentials, "username" | "password">;

type Env = {
  USERS: KVNamespace;
  JWT_SECRET: string;
};

type ResponseData = {
  message: string;
  code: number;
};
