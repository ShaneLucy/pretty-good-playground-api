import { describe, it, expect } from "vitest";
import { decodeJwt } from "jose";

import { generateJWT, verifyJWT } from "../../../src/authentication/index";

const [
  uuid,
  secret,
  issuer,
  audience,
  secondsInAMinute,
  minutesInAnHour,
  millisecondsInASecond,
  durationInHours,
] = ["uuid", "secret", "pretty-good-playground", "questions:answers:account", 60, 60, 1_000, 5];

describe("the generateJWT function works correctly", () => {
  it("returns a jwt string, containing the correct uuid, iat, iss, aud and exp fields", async () => {
    const jwt = await generateJWT(uuid, secret, durationInHours);
    const decodedJWT = (decodeJwt(jwt) as unknown) as AccessTokenBody;

    expect(jwt).to.be.a("string");
    expect(decodedJWT.iss).to.deep.equal(issuer);
    expect(decodedJWT.aud).to.deep.equal(audience);
    expect(decodedJWT.exp).to.deep.equal(
      Math.floor(Date.now() / millisecondsInASecond) +
        secondsInAMinute * minutesInAnHour * durationInHours
    );
    expect(decodedJWT.iat).to.deep.equal(Math.floor(Date.now() / millisecondsInASecond));
    expect(decodedJWT.uuid).to.deep.equal(uuid);
  });
});

describe("the verifyJwt function works correctly", () => {
  it("given a valid jwt, correct secret and correct uuid, it returns true", async () => {
    const jwt = await generateJWT(uuid, secret, durationInHours);
    const result = await verifyJWT(jwt, secret, uuid, durationInHours);
    expect(result).toBeTruthy();
  });

  it("given a valid jwt but incorrect secret, it returns false", async () => {
    const jwt = await generateJWT(uuid, secret, durationInHours);
    const result = await verifyJWT(jwt, "invalidSecret", uuid, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given a valid token but it has expired, it returns false", async () => {
    const expiredTokenDuration = 0;
    const jwt = await generateJWT(uuid, secret, expiredTokenDuration);
    const result = await verifyJWT(jwt, secret, uuid, expiredTokenDuration);
    expect(result).toBeFalsy();
  });

  it("given a valid token but the payload uuid doesn't match the path provided uuid, it returns false", async () => {
    const jwt = await generateJWT(uuid, secret, durationInHours);
    const result = await verifyJWT(jwt, secret, "invalidUuid", durationInHours);
    expect(result).toBeFalsy();
  });

  it("given an invalid token, it returns false", async () => {
    const result = await verifyJWT("jwt", secret, uuid, durationInHours);
    expect(result).toBeFalsy();
  });
});
