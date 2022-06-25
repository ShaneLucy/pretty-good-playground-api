import { SignJWT, jwtVerify } from "jose";

const [issuer, audience, encoder] = [
  "pretty-good-playground",
  "questions:answers:account",
  new TextEncoder(),
];
const [secondsInAMinute, minutesInAnHour] = [60, 60];
export const convertHoursToSeconds = (hours: number) => secondsInAMinute * minutesInAnHour * hours;

export const generateJWT = async (
  uuid: string,
  secret: string,
  durationInHours: number
): Promise<string> =>
  new SignJWT({ uuid })
    .setProtectedHeader({ alg: "HS256", b64: true })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(Math.floor(Date.now() / 1_000) + convertHoursToSeconds(durationInHours))
    .sign(encoder.encode(secret));

export const verifyJWT = async (
  jwt: string,
  jwtSecret: string,
  uuid: string | undefined,
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

    const payload = (result.payload as unknown) as AccessTokenBody;

    if (payload.uuid !== uuid) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};
