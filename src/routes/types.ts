import { ParsedQs } from "qs";
import React from "react";
import { RouteComponentProps, match as Match } from "react-router";

import initStore from "@/store";

type RouteDetail = {
  location: string;
  path: string;
  query: ParsedQs;
  params: { [key: string]: string };
};

export interface RouteConfigComponentProps<
  Params extends { [K in keyof Params]?: string } = {}
> extends RouteComponentProps<Params> {
  route?: RouteConfig;
}

export type ServerFetchFunc = (
  route: RouteDetail,
  store: ReturnType<typeof initStore>
) => Promise<void>;

export interface RouteConfigProperties {
  serverFetch?: ServerFetchFunc;
}

export interface RouteConfig {
  component?:
    | (React.ComponentType<RouteConfigComponentProps<any>> &
        RouteConfigProperties)
    | (React.ComponentType<any> & RouteConfigProperties);
  render?: (props: RouteConfigComponentProps<any>) => React.ReactNode;
  path?: string | string[];
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;

  requiresAuth?: boolean;
  redirectPath?: string;
  routes?: RouteConfig[];
}

export interface MatchedRoute<Params extends { [K in keyof Params]?: string }> {
  route: RouteConfig;
  match: Match<Params>;
}
