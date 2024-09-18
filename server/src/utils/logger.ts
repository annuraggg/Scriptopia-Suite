import pino, { transport } from "pino";

const pinoLog = pino(
  { level: "info" },
  transport({
    targets: [
      {
        target: "@axiomhq/pino",
        options: {
          dataset: process.env.AXIOM_DATASET,
          token: process.env.AXIOM_TOKEN,
        },
      },
      // { target: "pino-pretty", options: { colorize: true } },
    ],
  })
);
class logger {
  info(message: string) {
    const date = new Date();
    pinoLog.info(message);
    console.log(
      `\x1b[37m[${date.toISOString()}] \x1b[32mINFO: \x1b[34m${message} \x1b[37m`
    );
  }

  error(message: string) {
    pinoLog.error(message);
    console.error(
      `\x1b[37m[${new Date().toISOString()}] \x1b[31mERROR: \x1b[31m${message} \x1b[37m`
    );
    console.trace();
  }

  warn(message: string) {
    pinoLog.warn(message);
    console.warn(
      `\x1b[37m[${new Date().toISOString()}] \x1b[33mWARN: \x1b[33m${message} \x1b[37m`
    );
  }
}

export default new logger();
