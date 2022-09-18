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

export const verifyJWT = async (
  jwt: string,
  jwtSecret: string,
  username: string | undefined,
  question: number | undefined,
  audience: Audience,
  durationInHours: number
): Promise<boolean> => {
  try {
    const result = await jwtVerify(jwt, encoder.encode(jwtSecret), {
      issuer,
      maxTokenAge: convertHoursToSeconds(durationInHours),
    });

    switch (audience) {
      case Audience.ALL:
        if (username === undefined) {
          return false;
        }

        return (
          ((result.payload as unknown) as AllAudienceAccessToken).payload.username === username
        );
      case Audience.QUESTIONS_ANSWERS:
        if (question === undefined) {
          return true;
        }

        return question <= ((result.payload as unknown) as QuestionAccessToken).payload.questionId;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};
