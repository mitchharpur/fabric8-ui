import { Injectable, Injector, ReflectiveInjector, OpaqueToken } from '@angular/core';
import { IWorkflowOptions } from '../contracts/workflow-options';
import { IWorkflow } from '../contracts/workflow';
import { IWorkflowProvider } from '../providers/workflow.provider';
import { LoggerFactory } from '../../common/logger';
/**
 * Creates concrete implementations of the IWorkflow contract
 * */
@Injectable()
export class WorkflowFactory {
  constructor(private _injector: Injector) {

  }
  create(options?: IWorkflowOptions): IWorkflow {
    // Instead of using the built in injector that will create a signleton
    // create a factory and use that to resolve
    let prov = ReflectiveInjector.resolve([IWorkflowProvider.FactoryProvider, LoggerFactory])
    let inj = ReflectiveInjector.fromResolvedProviders(prov);
    let tmp: IWorkflow = inj.get(IWorkflowProvider.InjectToken);
    //let tmp:IWorkflow= this._injector.get(Workflow);
    //let tmp:IWorkflow= this._injector.get(IWorkflowProvider.InjectToken);
    if (options) {
      tmp.initialize(options);
    }
    return tmp;

  }
}
