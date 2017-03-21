import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import { IForgeRequest, IForgePayload, IForgeResponse, ForgeService } from '../contracts/forge-service';

import { LoggerFactory, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class Fabric8ForgeService extends ForgeService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };
  private config = {
    //apiUrl: "http://localhost:8088"
    apiUrl: "https://forge.api.prod-preview.openshift.io"
  };
  constructor(private http: Http, loggerFactory: LoggerFactory) {
    super()
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8ForgeService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }
  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    //this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }
  ExecuteCommand(options: IForgeRequest = { command: { name: "empty" } }): Observable<IForgeResponse> {
    let command = "/forge/version";
    switch (options.command.name) {
      case "starter": {
        command = "/forge/commands/obsidian-new-project";
        break;
      }
      case "starter-next": {
        command = "/forge/commands/obsidian-new-project/next";
        break;
      }
      case "starter-validate": {
        command = "/forge/commands/obsidian-new-project/validate";
        break;
      }
      case "starter-execute": {
        command = "/forge/commands/obsidian-new-project/execute";
        break;
      }
      default: {
        return createEmptyResponse();
      }
    }
    return Observable.create((observer: Observer<IForgeResponse>) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(`${this.config.apiUrl}${command}`,headers)
        .map((response) => {
          let payload: IForgePayload = response.json();
          //console.dir(payload);
          return { payload: payload };
        })
        .catch(this.handleError)
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
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
