import { describe, it, expect } from "vitest";
import { ResponseMessages } from "../../../src/utilities";

import { validatePublicKey } from "../../../src/validation";

describe("the validatePublicKey function works correctly", () => {
  it("given a valid public key, returns true", async () => {
    const validKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
81wKVRnWj9o+qSvsbQv09r5zGiertreTgeg=
=wPIl
-----END PGP PUBLIC KEY BLOCK-----`;

    const result = await validatePublicKey(validKey);
    expect(result.isValid).toBeTruthy();
    expect(result.errorMessage.length).to.be.deep.equal(0);
  });

  it("given an invalid key, returns false", async () => {
    const invalidKey = `
mQINBGLkKPIBEAC6MR6bJheHuTrt+JK5K41cHWanxzip8bszZ7tjxFFy9MW2/zCj
ukGXKRW8bcjT+H4FhAqo4PjMhcuUxQ7uJi5GvpnV/IRm4MdWd0MQw0MycPAai5QB
QabKTwz1reTAIdk1Djlk253dERytstc8Cw07OUg4mvy3mf7fV5jyQeAkBB4/ykmc
l6h8mnOT5PiWudXsuZKAqnHlpzzqcoq5pH+j/tqM1IJhLt0d4OYJnS6C8trxpoF/
1Uc1E/HPhZDnH9FywbG3OImLoulTdcW44fo/RKo4XQiilnn56JkIQYoJ0UrzAUsx
`;
    const result = await validatePublicKey(invalidKey);
    expect(result.isValid).toBeFalsy();
    expect(result.errorMessage.length).to.be.greaterThan(0);
  });

  it("given a private key, returns false", async () => {
    const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
=AUdM
-----END PGP PRIVATE KEY BLOCK-----`;

    const result = await validatePublicKey(privateKey);
    expect(result.isValid).toBeFalsy();
    expect(result.errorMessage).to.be.deep.equal(ResponseMessages.PRIVATE_KEY_GIVEN);
  });
});
