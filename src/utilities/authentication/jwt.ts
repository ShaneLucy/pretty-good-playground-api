import { SignJWT } from "jose";

const generateJWT = async (username: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("pretty-good-playground")
    .setAudience("pretty-good-playground")
    .setExpirationTime("2h")
    .sign(encoder.encode(secret));
};

export default generateJWT;
