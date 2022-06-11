import getPort from "get-port";

const setBaseUrl = async (): Promise<{
  port: number;
  baseUrl: string;
}> => {
  const port = await getPort({ port: 9000 });
  const baseUrl = `http://127.0.0.1:${port}/api`;
  return {
    port,
    baseUrl,
  };
};

export default await setBaseUrl();
