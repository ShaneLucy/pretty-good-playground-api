import { describe, it, expect } from "vitest";
import { decodeJwt } from "jose";

import { Audience } from "../../../src/utilities";
import { generateJWT, verifyJWT } from "../../../src/authentication/index";

const [
  uuid,
  secret,
  issuer,
  secondsInAMinute,
  minutesInAnHour,
  millisecondsInASecond,
  durationInHours,
  question,
] = ["uuid", "secret", "pretty-good-playground", 60, 60, 1_000, 5, 2];

const payload = { uuid, question };

describe("the generateJWT function works correctly", () => {
  it("returns a jwt string, containing the correct uuid, iat, iss, aud and exp fields", async () => {
    const jwt = await generateJWT(payload, secret, durationInHours, Audience.ALL);
    const decodedJWT = (decodeJwt(jwt) as unknown) as AccessToken;

    expect(jwt).to.be.a("string");
    expect(decodedJWT.iss).to.deep.equal(issuer);
    expect(decodedJWT.aud).to.deep.equal(Audience.ALL);
    expect(decodedJWT.exp).to.deep.equal(
      Math.floor(Date.now() / millisecondsInASecond) +
        secondsInAMinute * minutesInAnHour * durationInHours
    );
    expect(decodedJWT.iat).to.deep.equal(Math.floor(Date.now() / millisecondsInASecond));
    expect(decodedJWT.payload.uuid).to.deep.equal(uuid);
    expect(decodedJWT.payload.question).to.deep.equal(question);
  });
});

describe("the verifyJwt function works correctly", () => {
  it("given a valid jwt, correct secret and correct uuid, it returns true", async () => {
    const jwt = await generateJWT(payload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, uuid, Audience.ALL, durationInHours);
    expect(result).toBeTruthy();
  });

  it("given a valid jwt but incorrect secret, it returns false", async () => {
    const jwt = await generateJWT(payload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, "invalidSecret", uuid, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given a valid token but it has expired, it returns false", async () => {
    const expiredTokenDuration = 0;
    const jwt = await generateJWT(payload, secret, expiredTokenDuration, Audience.ALL);
    const result = await verifyJWT(jwt, secret, uuid, Audience.ALL, expiredTokenDuration);
    expect(result).toBeFalsy();
  });

  it("given a valid token but the payload uuid doesn't match the path provided uuid, it returns false", async () => {
    const jwt = await generateJWT(payload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, "invalidUuid", Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given a valid token but the audience doesn't match, it returns false", async () => {
    const jwt = await generateJWT(payload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, uuid, Audience.QUESTIONS_ANSWERS, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given an invalid token, it returns false", async () => {
    const result = await verifyJWT("jwt", secret, uuid, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });
});
