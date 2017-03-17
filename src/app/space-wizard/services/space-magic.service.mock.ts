import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { IMagicRequest, IMagicResponse , SpaceMagicServiceBase} from '../models/space-magic'

/** space magic mock service */
@Injectable()
export class MockSpaceMagicService extends SpaceMagicServiceBase {
  constructor() { super() }
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
