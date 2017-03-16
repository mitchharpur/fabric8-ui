import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken } from '@angular/core';

import { Observable,  Subscriber } from 'rxjs/Rx';

import { IFieldSetService , FieldSetServiceBase  } from '../domain/field-set'


export { IFieldSetService, IFieldSet, IFieldInfo } from '../domain/field-set';

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
/** These providers uses the abstract base class as a contract. Does not require
 * using the @inject token to be reolved in a class that takes the service as
 * a dependency
 */
export class FieldSetServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: FieldSetServiceBase,
      useClass: MockFieldSetService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetServiceBase,
      useFactory: createServiceFactory(serviceBaseClassTypeName),
      deps: [],
      multi: false
    }
  }
}



