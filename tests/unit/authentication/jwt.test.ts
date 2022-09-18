import { describe, it, expect } from "vitest";
import { decodeJwt } from "jose";

import { Audience } from "../../../src/utilities";
import { generateJWT, verifyJWT } from "../../../src/authentication/index";

const [
  username,
  secret,
  issuer,
  secondsInAMinute,
  minutesInAnHour,
  millisecondsInASecond,
  durationInHours,
  questionId,
] = ["username", "secret", "pretty-good-playground", 60, 60, 1_000, 5, 2];

const allAudiencePayload: AllAudienceAccessTokenPayload = { username, questionId };
const questionsPayload: QuestionAccessTokenPayload = { questionId };

describe("the generateJWT function works correctly", () => {
  it("returns a jwt string, containing the correct username, iat, iss, aud and exp fields for All access audience", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const decodedJWT = (decodeJwt(jwt) as unknown) as AllAudienceAccessToken;

    expect(jwt).to.be.a("string");
    expect(decodedJWT.iss).to.deep.equal(issuer);
    expect(decodedJWT.aud).to.deep.equal(Audience.ALL);
    expect(decodedJWT.exp).to.deep.equal(
      Math.floor(Date.now() / millisecondsInASecond) +
        secondsInAMinute * minutesInAnHour * durationInHours
    );
    expect(decodedJWT.iat).to.deep.equal(Math.floor(Date.now() / millisecondsInASecond));
    expect(decodedJWT.payload.username).to.deep.equal(username);
    expect(decodedJWT.payload.questionId).to.deep.equal(questionId);
  });
});

describe("the verifyJwt function works correctly for all audience claims", () => {
  it("given a valid jwt, correct secret, correct audience and correct username returns true", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, username, undefined, Audience.ALL, durationInHours);
    expect(result).toBeTruthy();
  });

  it("given a valid jwt, correct secret, correct audience, correct username and a question returns true", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(
      jwt,
      secret,
      username,
      questionId,
      Audience.ALL,
      durationInHours
    );
    expect(result).toBeTruthy();
  });

  it("given a valid jwt but incorrect secret returns false", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(
      jwt,
      "invalidSecret",
      username,
      undefined,
      Audience.ALL,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but it has expired returns false", async () => {
    const expiredTokenDuration = 0;
    const jwt = await generateJWT(allAudiencePayload, secret, expiredTokenDuration, Audience.ALL);
    const result = await verifyJWT(
      jwt,
      secret,
      username,
      undefined,
      Audience.ALL,
      expiredTokenDuration
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but the payload username doesn't match the path provided username returns false", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(
      jwt,
      secret,
      "invalidUsername",
      undefined,
      Audience.ALL,
      durationInHours
    );
    expect(result).toBeFalsy();
  });
});

describe("the verifyJwt function works correctly for question claims", () => {
  it("given a valid jwt, correct secret, correct audience and correct question, without a username returns true", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      undefined,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeTruthy();
  });

  it("given a valid jwt, correct secret, correct audience, correct question and username returns true", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      username,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeTruthy();
  });

  it("given a request for a question less than or equal to the users current question, returns true", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      undefined,
      1,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeTruthy();
  });

  it("given a valid jwt but incorrect secret returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      "invalidSecret",
      undefined,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but it has expired returns false", async () => {
    const expiredTokenDuration = 0;
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      expiredTokenDuration,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      undefined,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      expiredTokenDuration
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but the payload question doesn't match the path provided question, returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      undefined,
      33,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but the audience doesn't match, returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      undefined,
      questionId,
      Audience.ALL,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given an invalid token, returns false", async () => {
    const result = await verifyJWT(
      "jwt",
      secret,
      username,
      undefined,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a request for a question greater then the users current question, returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      undefined,
      5,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });
});
