import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import { IForgeRequest, IForgeResponse, ForgeService } from '../contracts/forge-service';

import { getLogger, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class Fabric8ForgeService extends ForgeService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };
  constructor() {
    super()
    this.log = getLogger(this.constructor.name, Fabric8ForgeService.instanceCount++);
    this.log(`New instance...`);

  }
  ExecuteCommand(options: IForgeRequest = { command: { name: "empty" } }): Observable<IForgeResponse> {
    switch (options.command.name) {
      case "empty": {
        return createEmptyResponse();
      }
      default: {
        return createEmptyResponse();
      }
    }
  }
}

function createEmptyResponse(): Observable<IForgeResponse> {
  return Observable.create((observer: Observer<IForgeResponse>) => {
    observer.next({
      payload: {
      }
    })
    observer.complete();
  })
}
//     import { Injectable, Inject, ReflectiveInjector } from '@angular/core';
// import { Http, Response } from '@angular/http';
// import { Observable } from 'rxjs/Rx';

// import { CONFIG } from './../../config/constants';
// import { TestModel } from './test.model';

// @Injectable()
// export class TestService {

//     constructor(private http: Http, @Inject(CONFIG) private config) {}

//     getTestsModels(): Observable<TestModel[]> {

//         let url = this.config.apiUrl + "test";

//         return this.http.get(url)
//                         .map( (response) => response.json() )
//                         .map( (results) => {
//                             return results.map( (current) => {
//                                 return ReflectiveInjector.resolveAndCreate([TestModel]).get(TestModel);
//                             })
//                         })
//                         .catch(this.handleError);

//     }

//     private handleError(err): Observable<any> {

//         let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';

//         return Observable.throw(new Error(errMessage));

//     }

//}
