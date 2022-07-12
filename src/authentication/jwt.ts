import { SignJWT, jwtVerify } from "jose";
import { Audience } from "../utilities";

const [issuer, encoder] = ["pretty-good-playground", new TextEncoder()];
const [millisecondsInASecond, secondsInAMinute, minutesInAnHour] = [1_000, 60, 60];
export const convertHoursToSeconds = (hours: number) => secondsInAMinute * minutesInAnHour * hours;

export const generateJWT = async (
  payload: AccessTokenPayload,
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
  uuid: string | undefined,
  audience: Audience,
  durationInHours: number
): Promise<boolean> => {
  if (uuid === undefined) {
    return false;
  }

  try {
    const result = await jwtVerify(jwt, encoder.encode(jwtSecret), {
      issuer,
      audience,
      maxTokenAge: convertHoursToSeconds(durationInHours),
    });

    const accessToken = (result.payload as unknown) as AccessToken;

    if (accessToken.payload.uuid !== uuid) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};
