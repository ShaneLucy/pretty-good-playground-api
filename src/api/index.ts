const baseUrl = "https://chris-clinic-pin-psychological.trycloudflare.com";

const registerUser = async (username: string, password: string, salt: string) => {
  let response;
  try {
    response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        salt,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    response = await response.text();
  } catch (e) {
    response = e;
  }

  return response;
};

export default registerUser;
