import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { getEmptyFieldSet, IFieldSet, IFieldInfo, FieldSet, FieldSetServiceBase } from '../models/field-set'
import { ISpaceMagicService, IMagicResponse, IMagicRequest, ISpaceMagicServiceProvider } from '../services/space-magic.service'
/** field set service */
@Injectable()
export class FieldSetService extends FieldSetServiceBase {
  private spaceMagicService=ISpaceMagicServiceProvider.FactoryProvider.useFactory()
  constructor( /*@Inject(ISpaceMagicServiceProvider.InjectToken) private spaceMagicService: ISpaceMagicService*/) {
    super()
  }
  GetFieldSet(options: any = {}): Observable<IFieldSet> {
    let service: ISpaceMagicService = this.spaceMagicService;
    let observable: Observable<IFieldSet> = getEmptyFieldSet();
    switch (options.command) {
      case "first": {
        observable=getFirstFieldSet(options,this.spaceMagicService)
        break;
      }
      case "second": {
        observable=getFirstFieldSet(options,this.spaceMagicService)
        break;
      }
      default: {
        return getEmptyFieldSet();
      }
    }
    return observable;
  }
}

function getFirstFieldSet(options:any,apiClientService:ISpaceMagicService ):Observable<IFieldSet>
{
    let observable:Observable<IFieldSet> = Observable.create((observer: Observer<IFieldSet>) => {
      // invoke service and map results to fieldset
      apiClientService.ExecuteCommand({
        command: {
          name: "empty",
        }
      })
        .map((response: IMagicResponse) => mapResponseToFieldSet(response))
        .subscribe((fieldSet: IFieldSet) => {
          observer.next(fieldSet);
          observer.complete()
        })
    });
    return observable
}

function mapResponseToFieldSet(response: IMagicResponse): IFieldSet {

  let items: IFieldInfo[] =
    [
      {
        name: "f1",
        label: "label-f1",
        display: true,
        enabled: true,
        required: true,
        index: 0,
        valid: true,
        value: "f1-value"
      },
      {
        name: "f2",
        label: "label-f2",
        display: true,
        enabled: true,
        required: true,
        index: 0,
        valid: true,
        value: "f1-value-2"
      }
    ];
  let set = new FieldSet(...items);
  return set;
}
function mapFieldSetToRequest(fieldSet: IFieldSet): IMagicRequest {
  return { command: { name }, payload: {} };
}
