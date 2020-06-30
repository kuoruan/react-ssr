import Minimist from "minimist";
import PortFinder from "portfinder";

export function parseArgs(initValue?: {
  [key: string]: number | boolean | string;
}) {
  return Minimist(process.argv.slice(2), { default: initValue });
}

export function getRunPort(
  commandPort: string,
  defaultPort: number
): Promise<number> {
  let portNumber: number;

  let commandPortNumber, envPortNumber: number;
  if (commandPort && (commandPortNumber = parseInt(commandPort)) > 0) {
    portNumber = commandPortNumber;
  } else if (
    process.env.PORT &&
    (envPortNumber = parseInt(process.env.PORT)) > 0
  ) {
    portNumber = envPortNumber;
  } else {
    portNumber = defaultPort;
  }

  return PortFinder.getPortPromise({ port: portNumber });
}
