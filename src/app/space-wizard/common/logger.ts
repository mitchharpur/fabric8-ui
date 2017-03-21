import { Injectable, Inject } from '@angular/core';

export interface ILogEntry {
  message: string,
  warning?: boolean,
  error?: boolean,
  info?: boolean,
  inner?: any
}
export interface ILoggerDelegate {
  (options: string | ILogEntry): void
}
/** 
 * This is just a quick and dirty functional style logger allowing for unqique logger 'instances'
 * for each class 
 */

@Injectable()
export class LoggerFactory {
  createLoggerDelegate(name: string, instance: number = 0): ILoggerDelegate {
    function addLogEntry(entry: ILogEntry) {
      let method = "log";
      if (entry.error === true) {
        method = "error";
      }
      if (entry.warning === true) {
        method = "warn";
      }
      if (entry.info === true) {
        method = "info";
      }
      let typeStyle = "background:linear-gradient(#444, #333); border-radius:15px;padding:4px;color:lime;font-style:italic;border-left:solid 0px orangered;padding:3px;padding-left:10px;padding-right:10px"
      let instanceStyle = "background:linear-gradient(#444, #333);color:orangered; border-radius:10px;padding:3px;margin:3px 0;";
      let messageStyle = "background:linear-gradient(#444, #333);color:white; border-radius:10px;padding:3px 10px;";
      console[method].apply(null, [`%c${name}%c ${instance} %c${entry.message || ""}`, typeStyle, instanceStyle, messageStyle]);
    };
    function loggerDelegate(options: string | ILogEntry) {
      let entry = { message: "" };
      if (typeof options === "string") {
        entry.message = options || "";
      }
      else {
        Object.assign(entry, options);
      }
      addLogEntry(entry);
    };
    return loggerDelegate;
  }
}

