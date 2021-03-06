/* eslint no-await-in-loop: 0 */
/* eslint no-constant-condition: 0 */
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import fetch from "node-fetch";

import baseUrlConfig from "./base-url-config";

const oneMinuteInMilliseconds = 60_000;
const oneMilliSecond = 100;
const { port, baseUrl } = baseUrlConfig;
const waitForURLReachable = async (url: string, timeout: number) => {
  const timeoutThreshold = Date.now() + timeout;

  while (true) {
    try {
      await fetch(url);
      return true;
    } catch (err) {
      if (Date.now() > timeoutThreshold) {
        throw new Error(`URL ${url} not reachable after ${timeout}ms\n\n Error\n${err}`);
      }
      await new Promise((resolve) => setTimeout(resolve, oneMilliSecond));
    }
  }
};

const testServer = (): Promise<ChildProcessWithoutNullStreams> =>
  new Promise((resolve, reject) => {
    const server = spawn("npx", ["wrangler", "dev", "--port", port.toString()], { detached: true });

    server.on("error", reject);
    // server.stdout.on("data", (chunk: Buffer) => {
    //   console.log(chunk.toString());
    // });

    return waitForURLReachable(`${baseUrl}/health-check`, oneMinuteInMilliseconds)
      .then(() => resolve(server))
      .catch(() => reject);
  });

export default testServer;
