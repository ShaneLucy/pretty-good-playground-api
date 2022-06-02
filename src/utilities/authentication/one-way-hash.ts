export const encodePassword = (password: string, salt: string): ArrayBuffer => {
  const encoder = new TextEncoder();

  return encoder.encode(`${password}${salt}`);
};

export const convertHashToHexString = (hashedPassword: ArrayBuffer): string => {
  const numToHexRadix = 16;
  const padLength = 2;
  const hashArray = Array.from(new Uint8Array(hashedPassword));
  return hashArray.map((b) => b.toString(numToHexRadix).padStart(padLength, "0")).join("");
};

export const generateHash = async (encodedPassword: ArrayBuffer): Promise<ArrayBuffer> =>
  crypto.subtle.digest("SHA-512", encodedPassword);

export const generateSalt = (): string => crypto.randomUUID();

export const convertPlainTextToPasswordHash = async (
  password: string,
  salt: string
): Promise<string> => convertHashToHexString(await generateHash(encodePassword(password, salt)));
