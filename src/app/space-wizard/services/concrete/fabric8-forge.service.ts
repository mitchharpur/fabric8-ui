import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import { IForgeRequest, IForgePayload, IForgeResponse, ForgeService, ForgeCommands } from '../contracts/forge-service';

import { LoggerFactory, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class Fabric8ForgeService extends ForgeService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };
  private config = {
    //apiUrl: "http://localhost:8088"
    forge: {
      api: {
        url: {
          http: "http://forge.api.prod-preview.openshift.io",
          https: "https://forge.api.prod-preview.openshift.io"
        }
      }
    }
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
    this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }
  private GetCommand(url: string): Observable<IForgeResponse> {
    return Observable.create((observer: Observer<IForgeResponse>) => {
      let headers = new Headers();
      //headers.append(...) e.g ('Content-Type', 'application/json');
      //TODO: auth token
      this.log(`forge GET : ${url}`);
      this.http.get(url, headers)
        .map((response) => {
          let forgeResponse: IForgeResponse = { payload: response.json() };
          this.log(`forge GET response : ${url}`);
          console.dir(forgeResponse.payload);
          return forgeResponse;
        })
        .catch((err)=>this.handleError(err))
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
  }

  private PostCommand(url: string, body: any): Observable<IForgeResponse> {
    return Observable.create((observer: Observer<IForgeResponse>) => {
      let headers = new Headers();
      //headers.append('Content-Type', 'application/json');
      this.log(`forge POST : ${url}`);
      console.dir(body)
      this.http.post(url, body, headers)
        .map((response) => {
          let forgeResponse: IForgeResponse = { payload: response.json() };
          this.log(`forge POST response : ${url}`);
          console.dir(forgeResponse.payload);
          return forgeResponse;
        })
        .catch((err)=>this.handleError(err))
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
  }

  ExecuteCommand(request: IForgeRequest = { command: { name: "empty" } }): Observable<IForgeResponse> {
    switch (request.command.name) {
      case ForgeCommands.forgeStarter: {
        request.command.forgeCommandName = "obsidian-new-project";
        return this.forgeWorkflowCommandRequest(request);
      }
      case ForgeCommands.forgeQuickStart: {
        request.command.forgeCommandName = "obsidian-new-quickstart";
        return this.forgeWorkflowCommandRequest(request);
      }
      default: {
        return Observable.empty();
      }
    }
  }

  private forgeWorkflowCommandRequest(request: IForgeRequest): Observable<IForgeResponse> {
    let parameters: any = request.command.parameters;
    let forgeCommandName = request.command.forgeCommandName;
    switch (parameters.workflow.step.name) {
      case "begin":
        {
          let url = `${this.config.forge.api.url.https}/forge/commands/${forgeCommandName}`;
          return this.GetCommand(url);
        }
      case "next":
        {
          let url = `${this.config.forge.api.url.https}/forge/commands/${forgeCommandName}/next`;
          let body = parameters.data || {};
          body.stepIndex = parameters.workflow.step.index || 1;
          return this.PostCommand(url, body);
        }
      case "validate":
        {
          let url = `${this.config.forge.api.url.https}/forge/commands/${forgeCommandName}/validate`;
          let body = parameters.data || {};
          return this.PostCommand(url, body);
        }
      case "execute":
        {
          let url = `${this.config.forge.api.url.https}/forge/commands/${forgeCommandName}/execute`;
          let body = parameters.data;
          return this.PostCommand(url, body);
        }
      default: {
        this.log({ message: `invalid forge command:${request.command.name} step:${parameters.workflow.step.name}`, error: true });
        return Observable.empty();
      }
    }
  }
}
