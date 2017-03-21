import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

/** contracts  */
import { IFieldSet, FieldSet, IFieldInfo, WidgetType, FieldWidgetType, IFieldOption, IAppGeneratorService, AppGeneratorService } from '../contracts/app-generator-service'

/** dependencies */
import { IForgeService, IForgeResponse, IForgeRequest, IForgeServiceProvider, IForgeField, IForgeValueChoice } from '../forge.service'


import { getLogger, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };

  constructor( @Inject(IForgeServiceProvider.InjectToken) private forgeGatewayService: IForgeService) {
    super()
    this.log = getLogger(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    this.log(`New instance...`);
  }
  getFieldSet(options: any = {}): Observable<IFieldSet> {
    let service: IForgeService = this.forgeGatewayService;
    let observable: Observable<IFieldSet> = this.createEmptyFieldSet();
    switch (options.command) {
      case "quickstart": {
        observable = executeCommand({command:{name:"quickstart"}}, this.forgeGatewayService)
        break;
      }
      case "wizard": {
        observable = executeCommand({command:{name:"wizard"}}, this.forgeGatewayService)
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
    .map((response: IForgeResponse) => mapResponseToFieldSet(response))
    .subscribe((fieldSet: IFieldSet) => {
      observer.next(fieldSet);
      observer.complete();
    })
  });
  return observable;
}


function mapResponseToFieldSet(response: IForgeResponse): IFieldSet {

  let fieldSet = new FieldSet();
  //assign the original payload to the fieldset
  fieldSet.context = response.payload;
  for (let forgeField of response.payload.input) {
    let fieldInfo: IFieldInfo = {
      name: forgeField.name,
      value: forgeField.value,
      display: {
        widget: mapWidgetType(forgeField),
        label: forgeField.label,
        required: forgeField.required,
        enabled: forgeField.enabled,
        valueOptions: mapValueOptions(forgeField),
        hasOptions: mapHasOptions(forgeField),
        visible: forgeField.deprecated === false,
        index: 0
      },
      context: forgeField
    };
    fieldSet.push(fieldInfo);
  }
  let set = new FieldSet(...fieldSet);
  return set;
}

function mapHasOptions(field: IForgeField): boolean {
  if (field.valueChoices) {
    return field.valueChoices.length > 0;
  }
  return false;
}
function mapValueOptions(field: IForgeField): Array<IFieldOption> {
  let items: Array<IFieldOption> = []
  for (let choice of field.valueChoices) {
    items.push({ id: choice.id, description: choice.description })
  }
  return items;
}

function mapWidgetType(field: IForgeField): WidgetType {
  switch (field.class.toLowerCase()) {
    case "uiinput":
      {
        return FieldWidgetType.TexInput;
      }
    case "uiselectone":
      {
        return FieldWidgetType.SingleSelection;
      }
    default:
      {
        return FieldWidgetType.TexInput;
      }
  }
}
function mapFieldSetToRequest(fieldSet: IFieldSet): IForgeRequest {
  return { command: { name }, payload: {} };
}
