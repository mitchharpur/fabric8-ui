import { Observable, Observer, Subscriber } from 'rxjs/Rx';
import { OpaqueToken } from '@angular/core';

export { IFieldSet,FieldSet, IFieldInfo} from '../../models/field-set'

import { IFieldSet, IFieldInfo} from '../../models/field-set'

/** AppGenerator contract */

export interface IAppGeneratorService {
  getFieldSet(options?:any): Observable<IFieldSet>
}

/** AppGeneratorService contract using abstract base class */

export abstract class AppGeneratorService implements IAppGeneratorService {
  abstract getFieldSet(options?:any): Observable<IFieldSet>;
  protected createEmptyFieldSet():Observable<IFieldSet>
  {
    return Observable.create((observer:Observer<IFieldSet>) => {
      observer.next([]);
      observer.complete();
    });
  }

}

/**
 * service dependency injection token to be used with @Inject annotation.
 * There is some magic string badness here but typescript interface metadata
 * query is limited
 */

export const IAppGeneratorServiceToken = new OpaqueToken("IAppGeneratorService");

