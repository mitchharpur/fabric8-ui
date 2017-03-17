import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { IMagicRequest, IMagicResponse , SpaceMagicServiceBase} from '../models/space-magic'
import { getLogger, ILoggerDelegate } from '../models/logger';

/** space magic mock service */
@Injectable()
export class ConcreteSpaceMagicService extends SpaceMagicServiceBase {
  static instanceCount: number = 0;
  private _instance: number = 0;
  private log: ILoggerDelegate = () => { };
  constructor() { 
    super()
    ConcreteSpaceMagicService.instanceCount++;
    this._instance=ConcreteSpaceMagicService.instanceCount;
    this.log = getLogger(this.constructor.name, this._instance);
    this.log(`New instance...`);   
 
  }
  ExecuteCommand(options:IMagicRequest={command:{name:"empty"}}): Observable<IMagicResponse> {
    switch(options.command.name)
    {
      case "empty":{
        return getEmptyResponse();
      }
      default:{
        return getEmptyResponse();
      }
    }
  }
}

function getEmptyResponse():Observable<IMagicResponse>{
  return Observable.create((observer:Observer<IMagicResponse>)=>{
    observer.next({
      payload:{
      }
    })
    observer.complete();
  })
}
