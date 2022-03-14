import winston from 'winston';

const colorizer = winston.format.colorize();
const {
  combine, timestamp, printf, simple
} = winston.format;

const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    data: 2,
    info: 3,
    debug: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    warn: 'magenta',
    data: 'grey',
    info: 'green',
    debug: 'yellow',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'blue'
  }
};

colorizer.addColors(myCustomLevels.colors);

const logger = winston.createLogger({
  colorize: true,
  prettyPrint: true,
  level: 'custom',
  levels: myCustomLevels.levels,
  format: combine(
    simple(),
    timestamp({
      format: 'HH:mm:ss DD-MM-YYYY'
    }),
    printf(
      (msg) => {
        return colorizer.colorize(
          msg.level,
          `[LOGGER-${msg.level.toUpperCase()}] [${msg.timestamp}]: ${msg.message}`
        );
      }
    )
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
