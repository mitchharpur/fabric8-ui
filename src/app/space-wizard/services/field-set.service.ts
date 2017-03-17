import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken , ReflectiveInjector } from '@angular/core';
import { Observable,  Subscriber } from 'rxjs/Rx';




import { MockFieldSetService } from './field-set.service.mock'
import { ConcreteFieldSetService } from './field-set.service.concrete'

export { IFieldSetService, IFieldSet, IFieldInfo, FieldSetServiceBase } from '../models/field-set';
import { IFieldSet,FieldSetServiceBase} from '../models/field-set'
import { ISpaceMagicServiceProvider, ISpaceMagicService} from './space-magic.service'

/**
 * service dependency injection helper constructs
 */
const  BaseClassName =  "FieldSetServiceBase";
const  ClassName =  "FieldSetService";
const  InterfaceName = "IFieldSetService";
const  InterfaceToken = new OpaqueToken(InterfaceName);



// TODO: use class provider to resolve dependecies vi di
//let injector=ReflectiveInjector.resolveAndCreate([FieldSetServiceProvider.ClassProvider])
//let tmp= injector.get(FieldSetServiceBase);


/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class IFieldSetServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return { //serviceInterfaceFactoryProvider;
      provide: InterfaceToken,
      useFactory:(spaceMagicService:ISpaceMagicService)=>{
        return new ConcreteFieldSetService(spaceMagicService);
      },
      deps:[ISpaceMagicServiceProvider.InjectToken]
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return { 
      provide: InterfaceToken,
      useFactory:()=>{
        return new MockFieldSetService();
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
export class FieldSetServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: FieldSetServiceBase,
      useClass: ConcreteFieldSetService
    }
  }
  static get MockClassProvider(): ClassProvider {
    return {
      provide: FieldSetServiceBase,
      useClass: MockFieldSetService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetServiceBase,
      useFactory:(spaceMagicService:ISpaceMagicService)=>{ 
        return new ConcreteFieldSetService(spaceMagicService); 
      },
      deps: [ISpaceMagicServiceProvider.InjectToken],
      multi: false
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetServiceBase,
      useFactory:()=>{ 
        return new MockFieldSetService(); 
      },
      multi: false
    }
  }
}



