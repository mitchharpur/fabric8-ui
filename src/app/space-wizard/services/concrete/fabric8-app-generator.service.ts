import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { createEmptyFieldSet, IFieldSet, IFieldInfo, FieldSet, AppGeneratorService } from '../../models/app-generator'
import { IForgeService, IForgeResponse, IForgeRequest, IForgeServiceProvider } from '../forge.service'
import { getLogger, ILoggerDelegate } from '../../models/logger';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 0;
  private log: ILoggerDelegate = () => { };



  constructor(@Inject(IForgeServiceProvider.InjectToken) private forgeGatewayService:IForgeService ) {
    super()
    this.log = getLogger(this.constructor.name,Fabric8AppGeneratorService.instanceCount++);
    this.log(`New instance...`);
  }
  GetFieldSet(options: any = {}): Observable<IFieldSet> {
    let service: IForgeService = this.forgeGatewayService;
    let observable: Observable<IFieldSet> = createEmptyFieldSet();
    switch (options.command) {
      case "first": {
        observable=getFirstFieldSet(options,this.forgeGatewayService)
        break;
      }
      case "second": {
        observable=getFirstFieldSet(options,this.forgeGatewayService)
        break;
      }
      default: {
        return createEmptyFieldSet();
      }
    }
    return observable;
  }

}

function getFirstFieldSet(options:any,api:IForgeService ):Observable<IFieldSet>
{
    let observable:Observable<IFieldSet> = Observable.create((observer: Observer<IFieldSet>) => {
      // invoke service and map results to fieldset
      api.ExecuteCommand({
        command: {
          name: "empty",
        }
      })
        .map((response: IForgeResponse) => mapResponseToFieldSet(response))
        .subscribe((fieldSet: IFieldSet) => {
          observer.next(fieldSet);
          observer.complete()
        })
    });
    return observable
}

function mapResponseToFieldSet(response: IForgeResponse): IFieldSet {

  let items: IFieldInfo[] =
    [
      {
        name: "maped-f1",
        label: "label-f1",
        display: true,
        enabled: true,
        required: true,
        index: 0,
        valid: true,
        value: "f1-value"
      },
      {
        name: "mapped-f2",
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
function mapFieldSetToRequest(fieldSet: IFieldSet): IForgeRequest {
  return { command: { name }, payload: {} };
}
