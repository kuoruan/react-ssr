import { createBrowserHistory, createMemoryHistory } from "history";

export default function configureHistory(url = "/") {
  return __isClient__
    ? createBrowserHistory()
    : createMemoryHistory({ initialEntries: [url] });
}
