import { SignJWT } from "jose";

const generateJWT = async (uuid: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const thirtyMinutesInMilliseconds = 300_000;
  return new SignJWT({ uuid })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("pretty-good-playground")
    .setAudience("pretty-good-playground")
    .setExpirationTime(Date.now() + thirtyMinutesInMilliseconds)
    .sign(encoder.encode(secret));
};

export default generateJWT;
