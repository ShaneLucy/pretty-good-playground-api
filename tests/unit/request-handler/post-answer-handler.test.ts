import { describe, it, expect, vi } from "vitest";

import "whatwg-fetch";

import { postAnswerHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import type { CustomRequest } from "../../../src/types/custom";

/**
 * @vitest-environment jsdom
 */
describe("the postAnswerHandler function works correctly", () => {
  const answer = "answer 1";
  const kvNamespace = {
    put: vi.fn(),
    get: vi.fn().mockReturnValue(answer),
    delete: vi.fn(),
    getWithMetadata: vi.fn(),
    list: vi.fn(),
  };

  const env = {
    USERS: kvNamespace,
    QUESTIONS: kvNamespace,
    PGP_KEY: kvNamespace,
    ANSWERS: kvNamespace,
    JWT_SECRET: "AVerySecretPassphrase",
    PRIVATE_KEY_PASSPHRASE: "",
    ALLOWED_ORIGIN: "*",
    JWT_DURATION_HOURS: 2,
  } as Env;

  vi.mock("../../../src/authentication", () => ({
    generateJWT: vi.fn().mockReturnValue("jwt"),
  }));

  it(`when given an answer that matches an answer id returns the answer`, async () => {
    const request = new Request("hi", {
      method: "POST",
      body: JSON.stringify({ answer }),
    }) as CustomRequest;

    const response = await postAnswerHandler(request, env);
    const responseData = (await response.json()) as AnswerResponseBody;

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(responseData.answer).to.be.equal(answer);
    expect(responseData.authToken).to.be.deep.equal("jwt");
  });

  it("when given an empty request body, returns the correct status and message", async () => {
    const request = new Request("hi", {
      method: "POST",
      body: JSON.stringify({}),
    }) as CustomRequest;

    const response = await postAnswerHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    expect(await response.json()).to.be.equal(ResponseMessages.ANSWER_EMPTY);
  });

  it("when given a request body with an empty string, returns the correct status and message", async () => {
    const request = new Request("hi", {
      method: "POST",
      body: JSON.stringify({ answer: "" }),
    }) as CustomRequest;

    const response = await postAnswerHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    expect(await response.json()).to.be.equal(ResponseMessages.ANSWER_EMPTY);
  });

  it("when the requested answer doesn't exist, returns the correct status and message", async () => {
    const kvNamespaceGetNull = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      getWithMetadata: vi.fn(),
      list: vi.fn(),
    };

    const envGetNull = {
      USERS: kvNamespace,
      QUESTIONS: kvNamespace,
      PGP_KEY: kvNamespace,
      ANSWERS: kvNamespaceGetNull,
      JWT_SECRET: "AVerySecretPassphrase",
      PRIVATE_KEY_PASSPHRASE: "",
      ALLOWED_ORIGIN: "*",
      JWT_DURATION_HOURS: 2,
    } as Env;

    const request = new Request("hi", {
      method: "POST",
      body: JSON.stringify({ answer }),
    }) as CustomRequest;

    const response = await postAnswerHandler(request, envGetNull);

    expect(response.status).to.be.equal(HttpStatusCodes.NOT_FOUND);
    expect(await response.json()).to.be.equal(ResponseMessages.ANSWER_NOT_FOUND);
  });

  it("when the supplied answer doesn't match the requested answer, returns the correct status and message", async () => {
    const request = new Request("hi", {
      method: "POST",
      body: JSON.stringify({ answer: "incorrect answer" }),
    }) as CustomRequest;

    const response = await postAnswerHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(await response.json()).to.be.equal(ResponseMessages.ANSWER_INCORRECT);
  });
});
