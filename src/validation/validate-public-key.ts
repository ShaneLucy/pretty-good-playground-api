import { readKey } from "openpgp";

import { ResponseMessages, formatKey } from "../utilities";

const validatePublicKey = async (key: string): Promise<ValidationResponse> => {
  let publicKey;

  try {
    publicKey = await readKey({
      armoredKey: formatKey(key),
    });
  } catch (e) {
    const error = e as Error;

    return {
      isValid: false,
      errorMessage: error.message,
    };
  }

  if (publicKey.isPrivate()) {
    return {
      isValid: false,
      errorMessage: ResponseMessages.PRIVATE_KEY_GIVEN,
    };
  }

  return {
    isValid: true,
    errorMessage: "",
  };
};

export default validatePublicKey;
