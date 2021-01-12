import { createBrowserHistory, createMemoryHistory, History } from "history";

export default function configureHistory(url = "/"): History {
  return __isClient__
    ? createBrowserHistory()
    : createMemoryHistory({ initialEntries: [url] });
}
