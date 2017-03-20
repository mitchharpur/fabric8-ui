  export interface ILogEntry
  {
    message:string,
    warning?:boolean,
    error?:boolean,
    info?:boolean,
  }
  export interface ILoggerDelegate{
    (options:string|ILogEntry):void
  }
  /** This is just a quick and dirty logger ... refactor later */

  export function getLogger(name:string,instance:number):ILoggerDelegate
  {
      return function logger(options:ILogEntry) {
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
        let typeStyle="background:linear-gradient(#444, #333); border-radius:15px;padding:4px;color:lime;font-style:italic;border-left:solid 0px orangered;padding:3px;padding-left:10px;padding-right:10px"
        let instanceStyle="background:linear-gradient(#444, #333);color:orangered; border-radius:10px;padding:3px;margin:3px 0;";
        let messageStyle="background:linear-gradient(#444, #333);color:white; border-radius:10px;padding:3px 10px;";
        console[method].apply(null, [`%c${name}%c ${instance} %c${entry.message || ""}`,typeStyle,instanceStyle,messageStyle]);
      };
  }
