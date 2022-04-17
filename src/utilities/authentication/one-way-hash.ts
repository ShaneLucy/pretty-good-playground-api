export const encodePassword = (password: string, salt: string): ArrayBuffer => {
  const encoder = new TextEncoder();

  return encoder.encode(`${password}${salt}`);
};

export const decodeHash = (hashedPassword: ArrayBuffer): string => {
  const hashArray = Array.from(new Uint8Array(hashedPassword)); // convert buffer to byte array
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const generateHash = async (encodedPassword: ArrayBuffer): Promise<ArrayBuffer> =>
  crypto.subtle.digest("SHA-512", encodedPassword);

export const generateSalt = (): string => crypto.randomUUID();
