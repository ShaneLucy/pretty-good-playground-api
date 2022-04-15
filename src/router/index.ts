import { Router } from "itty-router";
import {
  generateSalt,
  encodePassword,
  decodeOneWayHash,
  generateHash,
} from "../authentication-utils";
import registerUser from "../api";

const router = Router();

router.post("/register", async (request: Request) => {
  const { username, password } = await request.json();

  const salt = generateSalt();
  const encodedPassword = encodePassword(password, salt);
  const hashedPassword = decodeOneWayHash(await generateHash(encodedPassword));
  const response = await registerUser(username, hashedPassword, salt);

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-type": "application/json",
    },
  });
});

export default router;
