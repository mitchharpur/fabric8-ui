import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { getEmptyFieldSet, IFieldSet, IFieldInfo ,FieldSet, FieldSetServiceBase} from '../models/field-set'

/** field set mock service */
@Injectable()
export class MockFieldSetService extends FieldSetServiceBase {
  constructor() { super() }
  GetFieldSet(options:any={}): Observable<IFieldSet> {
    switch(options.command)
    {
      case "first":
      {
        return getFirstFieldSet();
      }
      case "second":
      {
        return getSecondFieldSet();
      }
      default:{
        return getEmptyFieldSet();
      }
    }
  }
}


function getFirstFieldSet():Observable<IFieldSet>
{
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
function getSecondFieldSet():Observable<IFieldSet>
{
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
        },
        {
          name: "f5",
          label: "label-f5",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f5-value-5"
        }
      ]);
      observer.complete();
    });
}
