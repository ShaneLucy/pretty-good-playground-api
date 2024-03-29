import { describe, it, expect, vi } from "vitest";

import "whatwg-fetch";

import { getQuestionHandler } from "../../../src/request-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";
import { requestBuilder } from "../../test-utils";

describe("the getQuestionHandler function works correctly", () => {
  const request = requestBuilder("", "GET");
  it(`when given a question id that exists returns the question text`, async () => {
    const questionText = "question 1";
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(questionText),
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

    const response = await getQuestionHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.SUCCESS);
    expect(await response.json()).to.be.equal(questionText);
  });

  it(`when given a question id that doesn't exist returns the correct status and message`, async () => {
    const kvNamespace = {
      put: vi.fn(),
      get: vi.fn().mockReturnValue(null),
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

    const response = await getQuestionHandler(request, env);

    expect(response.status).to.be.equal(HttpStatusCodes.NOT_FOUND);
    expect(await response.json()).to.be.equal(ResponseMessages.NOT_FOUND);
  });
});
