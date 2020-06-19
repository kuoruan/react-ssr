import { RouteComponentProps, match as Match } from "react-router";

export interface RouteConfigProps {
  route: RouteConfig;
}

type ServerFetchFunc = <P>(
  url: string,
  m: Match<P>
) => Promise<void> | Promise<void>[];

export interface RouteConfigProperties {
  serverFetch?: ServerFetchFunc;
}

export default interface RouteConfig {
  component?:
    | (React.ComponentType<RouteComponentProps<any> & RouteConfigProps> &
        RouteConfigProperties)
    | (React.ComponentType<any> & RouteConfigProperties);
  render?: (
    props: RouteComponentProps<any> & RouteConfigProps
  ) => React.ReactNode;
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
