import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

/** contracts  */
import { IAppGeneratorResponse, IFieldSet, FieldSet, IFieldInfo, FieldClassificationOptions, FieldClassification, IFieldValueOption, IAppGeneratorService, AppGeneratorService } from '../contracts/app-generator-service'

/** dependencies */
import { IForgeService, IForgeResponse, IForgeRequest, IForgeServiceProvider, IForgeInput, IForgeValueChoice, IForgePayload } from '../forge.service'


import { LoggerFactory, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;
  // default logger does nothing when called
  private log: ILoggerDelegate = () => { };

  constructor(
    @Inject(IForgeServiceProvider.InjectToken) private forgeService: IForgeService,
    loggerFactory: LoggerFactory
  ) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }
  getFieldSet(options: any = {}): Observable<IAppGeneratorResponse> {
    let service: IForgeService = this.forgeService;
    let observable = this.executeCommand(options)
    return observable;
  }
  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }
  private executeCommand(options: any): Observable<IAppGeneratorResponse> {
    this.log(`Invoking forge service for command = ${options.command.name} ...`)
    let observable: Observable<IAppGeneratorResponse> = Observable.create((observer: Observer<IAppGeneratorResponse>) => {
      this.forgeService.ExecuteCommand({
        command: options.command
      })
        .map((fr) => this.updateForgeResponseContext(fr, options.command))
        .map((fr) => this.mapForgeResponseToAppGeneratorResponse(fr))
        .map((ar) => this.updateAppGeneratorResponseContext(ar))
        .catch((err) => this.handleError(err))
        .subscribe((appGeneratorResponse: IAppGeneratorResponse) => {
          console.dir(appGeneratorResponse);
          observer.next(appGeneratorResponse);
          observer.complete();
        })
    });
    return observable;
  }
  private updateForgeResponseContext(forgeResponse: IForgeResponse, command: any): IForgeResponse {
    let forgePayload: IForgePayload = forgeResponse.payload;
    let workflow: any = {};
    if (forgePayload) {
      // the state we get from forge helps to determine the next workflow steps
      let forgeState = forgePayload.state
      if (forgeState.valid == false) {
        workflow.step = { name: "validate" };
      }
      else if (forgeState.wizard === true && forgeState.canMoveToNextStep === true) {
        workflow.step = { name: "next", index: 1 };
      }
      if (forgeState.canExecute === true) {
        workflow.step = { name: "execute" };
      }
    }
    forgeResponse.context = forgeResponse.context || {};
    // shape the command that will be used for the next command
    forgeResponse.context.nextCommand = {
      name: command.name,
      parameters: {
        workflow: workflow || {},
        data: forgePayload
      }
    }
    return forgeResponse;
  }
  private updateAppGeneratorResponseContext(response: IAppGeneratorResponse): IAppGeneratorResponse {
    this.log("updateAppGeneratorResponseContext...")
    //source.payload
    return response;
  }
  private mapForgeResponseToAppGeneratorResponse(source: IForgeResponse): IAppGeneratorResponse {
    let targetItems = new FieldSet();
    this.log("mapForgeResponseToAppGeneratorResponse...")
    //store the original api response for reset and data changed semantics
    //targetItems.context = source;
    for (let input of source.payload.inputs) {
      let sourceItem: IForgeInput = input;
      let targetItem: IFieldInfo = {
        name: sourceItem.name,
        value: sourceItem.value,
        display: {
          valueOptions: this.mapValueOptions(sourceItem),
          valueHasOptions: this.mapValueHasOptions(sourceItem),
          valueClassification: this.mapValueClassification(sourceItem),
          label: sourceItem.label,
          required: sourceItem.required,
          enabled: sourceItem.enabled,
          visible: sourceItem.deprecated === false,
          index: 0
        },
        //context: sourceItem
      };
      targetItems.push(targetItem);
    }
    let response: IAppGeneratorResponse = {
      payload: targetItems,
      context: source.context
    };
    return response;
  }

  private mapValueHasOptions(source: IForgeInput): boolean {
    if (source.valueChoices) {
      return source.valueChoices.length > 0;
    }
    return false;
  }
  private mapValueOptions(source: IForgeInput): Array<IFieldValueOption> {
    let items: Array<IFieldValueOption> = []
    if (source.valueChoices) {
      for (let choice of source.valueChoices) {
        if (source.description) {
          items.push({ id: choice.id, description: choice.description })
        }
        else {
          items.push({ id: choice.id })

        }
      }
    }
    return items;
  }

  private mapValueClassification(source: IForgeInput): FieldClassification {
    switch ((source.class || "").toLowerCase()) {
      case "uiinput":
        {
          return FieldClassificationOptions.SingleInput;
        }
      case "uiselectone":
        {
          return FieldClassificationOptions.SingleSelection;
        }
      case "uiselectmany": {
        return FieldClassificationOptions.SingleSelection;
      }
      default:
        {
          return FieldClassificationOptions.SingleInput;
        }
    }
  }

  private mapFieldSetToRequest(source: IFieldSet): IForgeRequest {
    return { command: { name }, payload: {} };
  }

}



