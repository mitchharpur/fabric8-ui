import {IWorkflowOptions} from '../contracts/workflow-options'
import {IWorkflow} from '../contracts/workflow'
import {Workflow} from './workflow'

/**
 * Creates concrete implementations of the IWorkflow contract
 * */

export class WorkflowFactory {
  static Create(options?: IWorkflowOptions): IWorkflow {
    let tmp = new Workflow();
    if (options) {
      tmp.initialize(options);
    }
    return tmp;
  }
}
