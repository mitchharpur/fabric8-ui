import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

/** contracts  */
import { IFieldSet, FieldSet, IFieldInfo, FieldValueClassification, FieldClassification, IFieldValueOption, IAppGeneratorService, AppGeneratorService } from '../contracts/app-generator-service'

/** dependencies */
import { IForgeService, IForgeResponse, IForgeRequest, IForgeServiceProvider, IForgeInput, IForgeValueChoice } from '../forge.service'


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
  getFieldSet(options: any = {}): Observable<IFieldSet> {
    let service: IForgeService = this.forgeService;
    let observable: Observable<IFieldSet> = this.createEmptyFieldSet();
    switch (options.command) {
      case "quickstart": {
        observable = executeCommand({ command: { name: "quickstart" } }, this.forgeService)
        break;
      }
      case "wizard": {
        observable = executeCommand({ command: { name: "wizard" } }, this.forgeService)
        break;
      }
      default: {
        return this.createEmptyFieldSet();
      }
    }
    return observable;
  }

}

function executeCommand(options: any, api: IForgeService): Observable<IFieldSet> {
  let observable: Observable<IFieldSet> = Observable.create((observer: Observer<IFieldSet>) => {
    // invoke service and map results to fieldset
    api.ExecuteCommand({
      command: {
        name: options.command.name,
      }
    })
      .map((response: IForgeResponse) => mapForgeResponseToFieldSet(response))
      .subscribe((fieldSet: IFieldSet) => {
        observer.next(fieldSet);
        observer.complete();
      })
  });
  return observable;
}


function mapForgeResponseToFieldSet(response: IForgeResponse): IFieldSet {

  let fieldSet = new FieldSet();
  //assign the original payload to the fieldset
  fieldSet.context = response.payload;
  for (let forgeField of response.payload.input) {
    let fieldInfo: IFieldInfo = {
      name: forgeField.name,
      value: forgeField.value,
      display: {
        valueClassification: mapValueClassification(forgeField),
        label: forgeField.label,
        required: forgeField.required,
        enabled: forgeField.enabled,
        valueOptions: mapValueOptions(forgeField),
        valueHasOptions: mapValueHasOptions(forgeField),
        visible:forgeField.deprecated === false,
        index: 0
      },
      //keep the original data for change tracking and revert semantics
      context: forgeField
    };
    fieldSet.push(fieldInfo);
  }
  let set = new FieldSet(...fieldSet);
  return set;
}

function mapValueHasOptions(field: IForgeInput): boolean {
  if (field.valueChoices) {
    return field.valueChoices.length > 0;
  }
  return false;
}

function mapValueOptions(field: IForgeInput): Array<IFieldValueOption> {
  let items: Array<IFieldValueOption> = []
  for (let choice of field.valueChoices) {
    items.push({ id: choice.id, description: choice.description })
  }
  return items;
}

function mapValueClassification(field: IForgeInput): FieldValueClassification {
  switch (field.class.toLowerCase()) {
    case "uiinput":
      {
        return FieldValueClassification.SingleInput;
      }
    case "uiselectone":
      {
        return FieldValueClassification.SingleSelection;
      }
    case "uiselectmany": {
      return FieldValueClassification.SingleSelection;
    }
    default:
      {
        return FieldValueClassification.SingleInput;
      }
  }
}

function mapFieldSetToRequest(fieldSet: IFieldSet): IForgeRequest {
  return { command: { name }, payload: {} };
}
