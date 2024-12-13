import pino, { destination } from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
      destination: "./logs/app.log",
      mkdir: true,
      colorize: false,
    },
  },
  redact: {
    paths: [
      "req.body.password",
      "req.body.email",
      "req.body.token",
      "req.params.token",
      "email",
      "token",
      "password",
    ],
    censor: "***",
  },
});

export default logger;
