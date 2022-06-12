import { IHTTPMethods } from "itty-router";

export type RouterMethodTypes = Pick<IHTTPMethods, Lowercase<RequestMethodTypes>>;
