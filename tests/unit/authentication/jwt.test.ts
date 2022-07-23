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
  questionId,
] = ["uuid", "secret", "pretty-good-playground", 60, 60, 1_000, 5, "2"];

const allAudiencePayload: AllAudienceAccessTokenPayload = { uuid, questionId };
const questionsPayload: QuestionAccessTokenPayload = { questionId };

describe("the generateJWT function works correctly", () => {
  it("returns a jwt string, containing the correct uuid, iat, iss, aud and exp fields for All access audience", async () => {
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
    expect(decodedJWT.payload.uuid).to.deep.equal(uuid);
    expect(decodedJWT.payload.questionId).to.deep.equal(questionId);
  });

  it("returns a jwt string, containing the correct question, iat, iss, aud and exp fields for question audience", async () => {
    const jwt = await generateJWT(questionsPayload, secret, durationInHours, Audience.ALL);
    const decodedJWT = (decodeJwt(jwt) as unknown) as QuestionAccessToken;

    expect(jwt).to.be.a("string");
    expect(decodedJWT.iss).to.deep.equal(issuer);
    expect(decodedJWT.aud).to.deep.equal(Audience.ALL);
    expect(decodedJWT.exp).to.deep.equal(
      Math.floor(Date.now() / millisecondsInASecond) +
        secondsInAMinute * minutesInAnHour * durationInHours
    );
    expect(decodedJWT.iat).to.deep.equal(Math.floor(Date.now() / millisecondsInASecond));
    expect(decodedJWT.payload.questionId).to.deep.equal(questionId);
  });
});

describe("the verifyJwt function works correctly for all audience claims", () => {
  it("given a valid jwt, correct secret, correct audience and correct uuid, it returns true", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, uuid, null, Audience.ALL, durationInHours);
    expect(result).toBeTruthy();
  });

  it("given a valid jwt, correct secret, correct audience, correct uuid and a question, it returns false", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, uuid, questionId, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given a valid jwt but incorrect secret, it returns false", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, "invalidSecret", uuid, null, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given a valid token but it has expired, it returns false", async () => {
    const expiredTokenDuration = 0;
    const jwt = await generateJWT(allAudiencePayload, secret, expiredTokenDuration, Audience.ALL);
    const result = await verifyJWT(jwt, secret, uuid, null, Audience.ALL, expiredTokenDuration);
    expect(result).toBeFalsy();
  });

  it("given a valid token but the payload uuid doesn't match the path provided uuid, it returns false", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(jwt, secret, "invalidUuid", null, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given a valid token but the audience doesn't match, it returns false", async () => {
    const jwt = await generateJWT(allAudiencePayload, secret, durationInHours, Audience.ALL);
    const result = await verifyJWT(
      jwt,
      secret,
      uuid,
      null,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given an invalid token, it returns false", async () => {
    const result = await verifyJWT("jwt", secret, uuid, null, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });
});

describe("the verifyJwt function works correctly for all question claims", () => {
  it("given a valid jwt, correct secret, correct audience and correct question, it returns true", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      null,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeTruthy();
  });

  it("given a valid jwt, correct secret, correct audience, correct question and uuid, it returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      uuid,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a valid jwt but incorrect secret, it returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      "invalidSecret",
      null,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but it has expired, it returns false", async () => {
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
      null,
      questionId,
      Audience.QUESTIONS_ANSWERS,
      expiredTokenDuration
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but the payload question doesn't match the path provided question, it returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(
      jwt,
      secret,
      null,
      "invalidQuestionId",
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });

  it("given a valid token but the audience doesn't match, it returns false", async () => {
    const jwt = await generateJWT(
      questionsPayload,
      secret,
      durationInHours,
      Audience.QUESTIONS_ANSWERS
    );
    const result = await verifyJWT(jwt, secret, null, questionId, Audience.ALL, durationInHours);
    expect(result).toBeFalsy();
  });

  it("given an invalid token, it returns false", async () => {
    const result = await verifyJWT(
      "jwt",
      secret,
      uuid,
      null,
      Audience.QUESTIONS_ANSWERS,
      durationInHours
    );
    expect(result).toBeFalsy();
  });
});
