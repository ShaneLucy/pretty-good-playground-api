import { IHTTPMethods } from "itty-router";
import type { Request as IttyRouterRequest } from "itty-router";

export type RouterMethodTypes = Pick<IHTTPMethods, Lowercase<RequestMethodTypes>>;

type CombinedRequest = Request & IttyRouterRequest;

export interface CustomRequest extends CombinedRequest {
  method: RequestMethodTypes;
  url: string;
  optional?: string;
}
