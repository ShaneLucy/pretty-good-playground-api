type UserModel = {
  username: string;
  password: string;
  salt: string;
  questionId: string;
  publicKey: string;
};

type UserAuthenticationData = Pick<UserModel, "username" | "password">;

type UserModelValue = Omit<UserModel, "username" | "publicKey">;

type Env = {
  USERS: KVNamespace;
  QUESTIONS: KVNamespace;
  PGP_KEY: KVNamespace;
  ANSWERS: KVNamespace;
  JWT_SECRET: string;
  PRIVATE_KEY_PASSPHRASE: string;
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
  questionId: number;
};

type FetchResponseData =
  | {
      authToken: string;
      username: string;
      uuid: string;
    }
  | string;

type RequestMethodTypes = "GET" | "HEAD" | "POST" | "OPTIONS" | "DELETE" | "PATCH";

type AllAudienceAccessTokenPayload = {
  username: string;
  questionId: number;
};

type QuestionAccessTokenPayload = {
  questionId: number;
};

type AccessToken = {
  iat: string;
  iss: string;
  aud: string;
  exp: number;
};

interface AllAudienceAccessToken extends AccessToken {
  payload: AllAudienceAccessTokenPayload;
}

interface QuestionAccessToken extends AccessToken {
  payload: QuestionAccessTokenPayload;
}

type UserParam = {
  username: string;
};

interface QuestionParam extends UserParam {
  question: string;
}

interface AnswerParam extends UserParam {
  answer: string;
}

type AnswerRequestBody = {
  answer: string;
};

type AnswerResponseBody = {
  answer: string;
  authToken: string;
};

type PasswordRequestBody = {
  password: string;
};

type PublicKeyRequestBody = {
  publicKey: string;
};
type ValidationResponse = {
  isValid: boolean;
  errorMessage: string;
};
