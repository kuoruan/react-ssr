import PortFinder from "portfinder";

type CommandArgs = {
  [key: string]: string | boolean;
};

export function parseArgs(initValue: CommandArgs = {}): CommandArgs {
  return process.argv
    .slice(2)
    .reduce((previousValue, currentValue, currentIndex, array) => {
      if (currentValue.indexOf("--") === 0) {
        const splits = currentValue.split("=");

        if (splits.length > 1) {
          const argFlag = splits[0].substring(2);
          const argValue = splits[1];

          return Object.assign({}, previousValue, { [argFlag]: argValue });
        } else {
          const argFlag = splits[0].substring(2);

          if (currentIndex < array.length - 1) {
            const argValue = array[currentIndex + 1];

            if (argValue.indexOf("-") < 0) {
              return Object.assign({}, previousValue, { [argFlag]: argValue });
            }
          }

          return Object.assign({}, previousValue, { [argFlag]: true });
        }
      } else if (currentValue.indexOf("-") === 0) {
        const argFlag = currentValue.substring(1);
        return Object.assign({}, previousValue, { [argFlag]: true });
      }
      return previousValue;
    }, initValue);
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
