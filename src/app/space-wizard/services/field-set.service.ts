import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken } from '@angular/core';

import { Observable,  Subscriber } from 'rxjs/Rx';

import { FieldSet , IFieldInfo , IFieldSetService , FieldSetService  } from '../domain/field-set'

export { IFieldSetService } from '../domain/field-set';

import { MockFieldSetService } from './field-set.mock.service'

/**
 * service dependency injection helper constructs
 */
const  serviceBaseClassTypeName =  "FieldSetService";
const  serviceInterfaceTypeName = "IFieldSetService";
const  serviceInterfaceTypeToken = new OpaqueToken(serviceInterfaceTypeName);
/**
 * This function returns a function that operates as the service factory for the FieldSetService.
 * the factory creates an instance of the service , but the provider resolves either an interface
 * or an abstract base class.
 * @param typeName : the name of the type for whihc a factory is to be retrieved.
 * This typeanme if just used for logging purposes.
 */
function createServiceFactory(typeName: string) {
  let serviceFactory= () => {
    let tmp = new MockFieldSetService();
    console.log(`FieldSet:serviceFactory: Resolving ${typeName} as an instance of ${tmp.constructor.name}.`);
    return tmp;
  };
  return serviceFactory;
}

/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class IFieldSetServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return { //serviceInterfaceFactoryProvider;
      provide: serviceInterfaceTypeToken,
      useFactory: createServiceFactory(serviceInterfaceTypeName)
    }
  }
  static get InjectToken(): OpaqueToken {
    return serviceInterfaceTypeToken;
  }
}
/** These providers uses the abstract base class as a contract. Does not required
 * using the @inject token
 */
export class FieldSetServiceProvider {
  /////////////////////////////
  static get ClassProvider(): ClassProvider {
    return {
      provide: FieldSetService,
      useClass: MockFieldSetService
    }
  }
  //////////////////////////////////////////
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetService,
      useFactory: createServiceFactory(serviceBaseClassTypeName),
      deps: [],
      multi: false
    }
  }
}




// /** Field set interface */
// export interface IFieldSetService {
//   FirstFieldSet: Observable<FieldSet>
//   NextFieldSet: Observable<FieldSet>
// }


// /** FieldSet Service contract */
// export abstract class FieldSetService implements IFieldSetService {
//   FirstFieldSet: Observable<FieldSet>
//   NextFieldSet: Observable<FieldSet>
// }


/** Mockfield set service */
// @Injectable()
// export class MockFieldSetService extends FieldSetService {
//   constructor() { super() }
//   get FirstFieldSet(): Observable<FieldSet> {
//     let tmp: Observable<FieldSet> = Observable.create(subscriber => {
//       let o = subscriber as Subscriber<FieldSet>;
//       o.next([
//         {
//           name: "f1",
//           label: "label-f1",
//           display: true,
//           enabled: true,
//           required: true,
//           index: 0,
//           valid: true,
//           value: "f1-value"
//         },
//         {
//           name: "f2",
//           label: "label-f2",
//           display: true,
//           enabled: true,
//           required: true,
//           index: 0,
//           valid: true,
//           value: "f1-value-2"
//         }
//       ]);
//       subscriber.complete();
//     });
//     return tmp;
//   }
//   get NextFieldSet(): Observable<FieldSet> {
//     return null;//this._fieldSet;
//   }
// }
