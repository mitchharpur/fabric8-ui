import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
/** contracts  */
import {
  AppGeneratorService,
  FieldSet,
  FieldWidgetClassification,
  FieldWidgetClassificationOptions,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IFieldInfo,
  IFieldSet,
  IFieldValueOption
} from '../contracts/app-generator-service';
/** dependencies */
import {
  IForgeCommandData,
  IForgeInput,
  IForgeRequest,
  IForgeCommandRequest,
  IForgeResponse,
  IForgeCommandResponse,
  IForgeService,
  IForgeServiceProvider
} from '../forge.service';


import { ILoggerDelegate, LoggerFactory } from "../../common/logger";

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;
  // default logger does nothing when called
  private log: ILoggerDelegate = () => {
  };

  constructor( @Inject(IForgeServiceProvider.InjectToken) private forgeService: IForgeService,
    loggerFactory: LoggerFactory) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }

  getFieldSet(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    let service: IForgeService = this.forgeService;
    let observable = this.executeForgeCommand(options)
    return observable;
  }

  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }

  private updateForgeInputsWithAppInputs(command: any): any {
    if (command.parameters.inputs) {
      for (let input of command.parameters.inputs) {
        let field: IFieldInfo = input;
        let data: Array<IForgeInput> = command.parameters.data.inputs;
        let forgeField = data.find(i => i.name === field.name);
        if (forgeField) {
          forgeField.value = field.value;
        }

      }
    }
    return command;
  }

  private executeForgeCommand(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    let command = this.updateForgeInputsWithAppInputs(options.command);
    this.log(`Invoking forge service for command = ${options.command.name} ...`);
    console.dir(command);
    let observable: Observable<IAppGeneratorResponse> = Observable.create((observer: Observer<IAppGeneratorResponse>) => {
      options.command = options.command || {};
      options.command.parameters = options.command.parameters || {};
      options.command.parameters.pipeline = options.command.parameters.pipeline || {};
      options.command.parameters.pipeline.stage = options.command.parameters.pipeline.stage || {};
      options.command.parameters.pipeline.stage.name = options.command.parameters.pipeline.stage.name || 'begin';
      let commandRequest: IForgeCommandRequest = {
        payload: {
          command: options.command
        }
      };
      this.forgeService.executeCommand(commandRequest)
        .map((fr) => this.mapForgeResponseToAppGeneratorResponse(fr))
        .catch((err) => this.handleError(err))
        .subscribe((appGeneratorResponse: IAppGeneratorResponse) => {
          console.dir(appGeneratorResponse);
          observer.next(appGeneratorResponse);
          observer.complete();
        })
    });
    return observable;
  }


  private mapForgeResponseToAppGeneratorResponse(source: IForgeCommandResponse): IAppGeneratorResponse {
    let responseData = new FieldSet();
    this.log('mapForgeResponseToAppGeneratorResponse...');

    source.payload = source.payload || { data: { inputs: [] } };
    source.payload.data = source.payload.data || { inputs: [] };
    source.payload.data.inputs = source.payload.data.inputs || [];

    for (let input of source.payload.data.inputs) {
      let sourceItem: IForgeInput = input;
      let targetItem: IFieldInfo = {
        name: sourceItem.name,
        value: sourceItem.value,
        valueType: this.mapFieldValueDataType(sourceItem),
        display: {
          options: this.mapValueOptions(sourceItem),
          hasOptions: this.mapValueHasOptions(sourceItem),

          inputType: this.mapWidgetClassification(sourceItem),
          label: sourceItem.label,
          required: sourceItem.required,
          enabled: sourceItem.enabled,
          visible: sourceItem.deprecated === false,
          index: 0
        },
      };
      if (targetItem.display.hasOptions && targetItem.display.inputType === FieldWidgetClassificationOptions.MultipleSelection) {
        //change to an array for binding purposes
        targetItem.value = [];
      }
      // add dynamic fields that vary with payload
      if (input.note) {
        targetItem.display.note = input.note;
      }
      if (source.payload.data.messages) {
        for (let message of source.payload.data.messages) {
          if (message.input == input.name) {
            targetItem.display.message = message
          }
        }
      }
      responseData.push(targetItem);
    }
    let response: IAppGeneratorResponse = {
      payload: {data:responseData},
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
          items.push({
            id: choice.id,
            name: choice.description,
            description: choice.description,
            visible: true,
            selected: false
          })
        }
        else {
          items.push({
            id: choice.id,
            name: choice.id,
            description: choice.id,
            visible: true,
            selected: false
          })

        }
      }
    }
    return items;
  }

  private mapFieldValueDataType(source: IForgeInput): string {
    if (!source.valueType) {
      return 'string';
    }
    switch ((source.valueType || "").toLowerCase()) {
      case 'java.lang.string': {
        return 'string';
      }
      case 'java.lang.boolean': {
        return 'boolean';
      }
      case 'java.lang.integer': {
        return 'number';
      }
      case 'org.jboss.forge.addon.projects.projectType': {
        return 'stackVariant';
      }
      default: {
        return 'string';
      }
    }
  }

  private mapWidgetClassification(source: IForgeInput): FieldWidgetClassification {
    switch ((source.class || '').toLowerCase()) {
      case 'uiinput': {
        return FieldWidgetClassificationOptions.SingleInput;
      }
      case 'uiselectone': {
        return FieldWidgetClassificationOptions.SingleSelection;
      }
      case 'uiselectmany': {
        return FieldWidgetClassificationOptions.MultipleSelection;
      }
      default: {
        return FieldWidgetClassificationOptions.SingleInput;
      }
    }
  }

  private mapFieldSetToRequest(source: IFieldSet): IForgeCommandRequest {
    return { payload: { command: { name: "" } } };
  }

}



