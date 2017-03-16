  export interface ILogEntry
  {
    message:string,
    warning?:boolean,
    error?:boolean,
    info?:boolean,
  }
  export interface ILoggerDelegate{
    (options:any|string|ILogEntry):void
  }
  /** This is just a quick and dirty logger ... refactor later */


  export function getLogger(name:string,instance:number):ILoggerDelegate
  {
      return function logger(options: any | string = {}) {
        let entry = { message: "" };
        if (typeof options === "string") {
          entry.message = options || "";
        }
        else {
          Object.assign(entry, options);
        }
        let method = "log";
        if (options.error === true) {
          method = "error";
        }
        if (options.warning === true) {
          method = "warn";
        }
        if (options.info === true) {
          method = "info";
        }
        console[method].apply(null, [`${name}:${instance}: ${entry.message || ""}`]);
      };
  }
