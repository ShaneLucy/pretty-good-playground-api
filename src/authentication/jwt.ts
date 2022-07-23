import { SignJWT, jwtVerify } from "jose";
import { Audience } from "../utilities";

const [issuer, encoder] = ["pretty-good-playground", new TextEncoder()];
const [millisecondsInASecond, secondsInAMinute, minutesInAnHour] = [1_000, 60, 60];
export const convertHoursToSeconds = (hours: number) => secondsInAMinute * minutesInAnHour * hours;

export const generateJWT = async (
  payload: AllAudienceAccessTokenPayload | QuestionAccessTokenPayload,
  secret: string,
  durationInHours: number,
  audience: Audience
): Promise<string> =>
  new SignJWT({ payload })
    .setProtectedHeader({ alg: "HS256", b64: true })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(
      Math.floor(Date.now() / millisecondsInASecond) + convertHoursToSeconds(durationInHours)
    )
    .sign(encoder.encode(secret));

const verifyAllAudienceAccessToken = (accessToken: AllAudienceAccessToken, uuid: string | null) => {
  if (accessToken.payload.uuid !== uuid) {
    return false;
  }
  return true;
};

const verifyQuestionAccessToken = (accessToken: QuestionAccessToken, question: string | null) => {
  if (accessToken.payload.questionId !== question) {
    return false;
  }
  return true;
};

export const verifyJWT = async (
  jwt: string,
  jwtSecret: string,
  uuid: string | null,
  question: string | null,
  audience: Audience,
  durationInHours: number
): Promise<boolean> => {
  if (uuid === null && audience === Audience.ALL) {
    return false;
  }

  if (uuid !== null && audience !== Audience.ALL) {
    return false;
  }

  if (question !== null && audience !== Audience.QUESTIONS_ANSWERS) {
    return false;
  }

  if (question === null && audience === Audience.QUESTIONS_ANSWERS) {
    return false;
  }

  try {
    const result = await jwtVerify(jwt, encoder.encode(jwtSecret), {
      issuer,
      audience,
      maxTokenAge: convertHoursToSeconds(durationInHours),
    });

    return audience === Audience.ALL
      ? verifyAllAudienceAccessToken((result.payload as unknown) as AllAudienceAccessToken, uuid)
      : verifyQuestionAccessToken((result.payload as unknown) as QuestionAccessToken, question);
  } catch (e) {
    return false;
  }
};
