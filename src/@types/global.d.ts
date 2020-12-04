declare interface Window {
  __PRELOADED_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare const __isClient__: boolean;
declare const __isServer__: boolean;

declare type OAsset = { js?: string | string[]; css?: string | string[] };

declare namespace Express {
  interface Request {
    assets: OAsset;
  }
}
