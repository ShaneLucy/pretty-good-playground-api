/* eslint no-underscore-dangle: 0 */
import { describe, it, expect } from "vitest";
import "whatwg-fetch";

import malformedRequestBodyHandler from "../../../src/middleware/error-handler/malformed-request-body-handler";
import { HttpStatusCodes, ResponseMessages } from "../../../src/utilities";

/**
 * @vitest-environment jsdom
 */

describe("the malformedRequestBodyHandler function works correctly", () => {
  it("given valid JSON returns undefined", async () => {
    const result = await malformedRequestBodyHandler(
      new Request("hi", { body: JSON.stringify("Hi!"), method: "POST" })
    );

    expect(result).to.deep.equal(undefined);
  });

  it("given invalid JSON returns a response with the correct status code & body", async () => {
    const result = await malformedRequestBodyHandler(
      new Request("hi", { body: "Hi!", method: "POST" })
    );

    expect(result?.status).to.deep.equal(HttpStatusCodes.BAD_REQUEST);
    // @ts-ignore
    expect(result?._bodyText).to.deep.equal(`"${ResponseMessages.MALFORMED_REQUEST_BODY}"`);
  });
});
