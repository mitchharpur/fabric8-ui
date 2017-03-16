import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { IFieldSet, IFieldInfo ,FieldSet, FieldSetServiceBase} from '../domain/field-set'

/** field set mock service */
@Injectable()
export class MockFieldSetService extends FieldSetServiceBase {
  constructor() { super() }
  FirstFieldSet(options): Observable<IFieldSet> {
    let tmp: Observable<IFieldSet> = Observable.create((observer:Observer<IFieldSet>) => {
      let items:IFieldInfo[]=
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
      let set=new FieldSet(...items);
      observer.next(set);
      observer.complete();
    });
    return tmp;
  }
  NextFieldSet(options:any): Observable<IFieldSet> {
    return Observable.create((observer:Observer<IFieldSet>) => {
      observer.next([
        {
          name: "f3",
          label: "label-f3",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f3-value"
        },
        {
          name: "f4",
          label: "label-f4",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f4-value-4"
        }
      ]);
      observer.complete();
    });
  }
}
