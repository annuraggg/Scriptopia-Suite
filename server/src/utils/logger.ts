import pino, { transport } from "pino";

const logger = pino(
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
      { target: "pino-pretty", options: { colorize: true } },
    ],
  })
);

export default logger;