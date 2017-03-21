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
    let observable = this.executeCommand(options)
    return observable;
  }
  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }
  private executeCommand(options: any): Observable<IFieldSet> {
    this.log(`Invoking forge service for command = ${options.command.name} ...`)
    let observable: Observable<IFieldSet> = Observable.create((observer: Observer<IFieldSet>) => {
      this.forgeService.ExecuteCommand({
        command: options.command
      })
        .map((response: IForgeResponse) => {
          return this.mapForgeResponseToFieldSet(response)
        })
        //.catch(this.handleError)
        .subscribe((fieldSet: IFieldSet) => {
          console.dir(fieldSet);
          observer.next(fieldSet);
          observer.complete();
        })
    });
    return observable;
  }

  private mapForgeResponseToFieldSet(response: IForgeResponse): IFieldSet {
  //debugger;
    let fieldSet = new FieldSet();
    //assign the original payload to the fieldset
    fieldSet.context = response.payload;
    for (let input of response.payload.inputs) {
      let source: IForgeInput = input;
      let target: IFieldInfo = {
        name: source.name,
        value: source.value,
        display: {
          valueClassification: this.mapValueClassification(source),
          label: source.label,
          required: source.required,
          enabled: source.enabled,
          valueOptions: this.mapValueOptions(source),
          valueHasOptions: this.mapValueHasOptions(source),
          visible: source.deprecated === false,
          index: 0
        },
        //keep the original data for change tracking and revert semantics
        context: source
      };
      fieldSet.push(target);
    }
    let set = new FieldSet(...fieldSet);
    console.dir(set);
    return set;
  }

  private mapValueHasOptions(source: IForgeInput): boolean {
    if (source.valueChoices) {
      return source.valueChoices.length > 0;
    }
    return false;
  }
  private mapValueOptions(source: IForgeInput): Array<IFieldValueOption> {
    let items: Array<IFieldValueOption> = []
    if(source.valueChoices)
    {
      for (let choice of source.valueChoices) {
        if(source.description)
        {
          items.push({ id: choice.id, description: choice.description })
        }
        else
        {
          items.push({ id: choice.id})

        }
      }
    }
    return items;
  }

  private mapValueClassification(source: IForgeInput): FieldValueClassification {
    switch ((source.class||"").toLowerCase()) {
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

  private mapFieldSetToRequest(source: IFieldSet): IForgeRequest {
    return { command: { name }, payload: {} };
  }

}



