import { createBrowserHistory, createMemoryHistory } from "history";

export default function configureHistory(url = "/") {
  return __isServer__
    ? createMemoryHistory({ initialEntries: [url] })
    : createBrowserHistory();
}
