import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken } from '@angular/core';

import { Observable,  Subscriber } from 'rxjs/Rx';

import { ISpaceMagicService , SpaceMagicServiceBase  } from '../models/space-magic'


export { ISpaceMagicService, SpaceMagicServiceBase, IMagicRequest, IMagicResponse } from '../models/space-magic';

import { MockSpaceMagicService } from './space-magic.service.mock'
import { ConcreteSpaceMagicService } from './space-magic.service.concrete'

/**
 * service dependency injection helper constructs
 */
const  BaseClassName =  "SpaceMagicServiceBase";
const  ClassName =  "SpaceMagicService";
const  InterfaceName = "ISpaceMagicService";
const  InterfaceToken = new OpaqueToken(InterfaceName);



/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class ISpaceMagicServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return { 
      provide: InterfaceToken,
      useFactory:()=>{ 
        return new ConcreteSpaceMagicService()
      }
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return { 
      provide: InterfaceToken,
      useFactory:()=>{ 
        return new MockSpaceMagicService()
      }
    }
  }
  static get InjectToken(): OpaqueToken {
    return InterfaceToken;
  }
}
/** These providers uses the abstract base class as a contract. Does not require
 * using the @inject token to be reolved in a class that takes the service as
 * a dependency
 */
export class SpaceMagicServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: SpaceMagicServiceBase,
      useClass: ConcreteSpaceMagicService
    }
  }
  static get MockClassProvider(): ClassProvider {
    return {
      provide: SpaceMagicServiceBase,
      useClass: MockSpaceMagicService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: SpaceMagicServiceBase,
      useFactory: ()=>{ return new ConcreteSpaceMagicService();},
      multi: false
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: SpaceMagicServiceBase,
      useFactory: ()=>{ return new MockSpaceMagicService();},
      multi: false
    }
  }
}



