/*--- LogConfig.ts ---*/
import { LogLevel } from "typescript-logging";
import { Log4TSProvider, Logger } from "typescript-logging-log4ts-style";

const provider = Log4TSProvider.createProvider("ExampleProvider", {
  /* Specify the various group expressions to match against */
  groups: [
    {
      expression: new RegExp("script.+"),
      level: LogLevel.Info /* This group will log on info instead */,
    },
    {
      expression: new RegExp("service.+"),
    },
  ],
});

export function getLogger(name: string): Logger {
  return provider.getLogger(name);
}
