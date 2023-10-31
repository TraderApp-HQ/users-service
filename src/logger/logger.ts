
import winston from 'winston';
import dotenv from "dotenv";

//init env variables
dotenv.config();

const { format } = require("winston");
const { combine, timestamp, label, printf } = format;
const SERVICE = process.env.service || '';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const transports = {
  console: new winston.transports.Console({ level: 'info' }),
  grafana: new winston.transports.Http({ host: 'localhost', port:8080 }),
  cloudWatch: new winston.transports.Http({ host: 'localhost', port:8080 })
};

// const customFormat = printf(({ level, label, message, timestamp }) => {
//     return `[${label}] ${ENVIRONMENT} ${timestamp}  ${level}: ${message}`;
//   });


  winston.loggers.add('grafana', {
    format: combine(label({ label: SERVICE }), timestamp(), format.json()),
    transports: [
        transports.console,
        transports.grafana
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
      ]
  });

  winston.loggers.add('cloudWatch', {
    format: combine(
      label({ label: SERVICE }),
      timestamp(),
      format.json()
    ),
    transports: [
        transports.console,
        transports.cloudWatch
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
      ]
  });

  class logger {

    grafana: winston.Logger;
    constructor() {
      this.grafana = winston.loggers.get('grafana');
    }

    info(message: any){
        transports.console.level = transports.grafana.level ="info"
        this.grafana.info(message)
    }

    warn(message: any):void{
        transports.console.level = transports.grafana.level ="warn"
        this.grafana.warn(message)
    }

    error(message: any):void{
        transports.console.level = transports.grafana.level = "error"
        this.grafana.error(message)
    }

    debug(message: any): void{
        transports.console.level = transports.grafana.level ="debug"
        this.grafana.log(transports.console.level, message)
    }

    log(message: any) : void{
      transports.console.level = transports.grafana.level ="info"
      this.grafana.log(transports.console.level, message)
    }

  }

  export default new logger();