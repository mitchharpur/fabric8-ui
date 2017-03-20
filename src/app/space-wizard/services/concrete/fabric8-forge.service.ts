import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import { IForgeRequest, IForgeResponse , ForgeService} from '../contracts/forge-service';
import { getLogger, ILoggerDelegate } from '../../models/logger';

@Injectable()
export class Fabric8ForgeService extends ForgeService {
  static instanceCount: number = 0;
  private log: ILoggerDelegate = () => { };
  constructor() {
    super()
    this.log = getLogger(this.constructor.name,Fabric8ForgeService.instanceCount++);
    this.log(`New instance...`);

  }
  ExecuteCommand(options:IForgeRequest={command:{name:"empty"}}): Observable<IForgeResponse> {
    switch(options.command.name)
    {
      case "empty":{
        return createEmptyResponse();
      }
      default:{
        return createEmptyResponse();
      }
    }
  }
}

function createEmptyResponse():Observable<IForgeResponse>{
  return Observable.create((observer:Observer<IForgeResponse>)=>{
    observer.next({
      payload:{
      }
    })
    observer.complete();
  })
}
