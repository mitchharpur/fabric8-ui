import { Observable,Observer,Subscriber } from 'rxjs/Rx' //Observable';

export class IFieldInfo
{
  name:string;
  label:string;
  display:boolean;
  enabled:boolean;
  required:boolean;
  index:number;
  valid:boolean;
  value:number|string|boolean|Array<any>;
}

export class FieldSet extends Array<IFieldInfo>
{

}

export interface IFieldSetService
{
   FirstFieldSet:Observable<FieldSet>
   NextFieldSet:Observable<FieldSet>
}

export class MockFieldSetService implements IFieldSetService
{
  constructor(){}
  get FirstFieldSet():Observable<FieldSet>{
     let tmp:Observable<FieldSet> =Observable.create(subscriber => {
         let o=subscriber as Subscriber<FieldSet>;
         o.next([
         {
              name:"f1",
              label:"label-f1",
              display:true,
              enabled:true,
              required:true,
              index:0,
              valid:true,
              value:"f1-value"
         },
         {
              name:"f2",
              label:"label-f2",
              display:true,
              enabled:true,
              required:true,
              index:0,
              valid:true,
              value:"f1-value-2"
         }
         ]);
         subscriber.complete();
     });
     return tmp;
   }
   get NextFieldSet(): Observable<FieldSet> {
    return null;//this._fieldSet;
   }
}

export class FieldSetServiceFactory
{
  constructor(){

  }
  create():IFieldSetService{
      let tmp= new MockFieldSetService();
      return tmp;
   }

}

