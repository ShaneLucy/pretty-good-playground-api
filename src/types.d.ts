type User = {
  username: string;
  password: string;
  salt: string;
};

type Env = {
  USERS: KVNamespace;
  JWT_SECRET: string;
};
