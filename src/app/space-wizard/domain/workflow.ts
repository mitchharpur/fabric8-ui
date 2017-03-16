import { Observable,  Subscriber } from 'rxjs/Rx';

/** creates concrete implementations of the IWorkflow contract */
export { WorkflowFactory} from './workflow.concrete';

/** Defines the signature of the delegate that will do a deferred retrieval a workflow step query
 * the return type of the delegate is a partial workflowstep OR string (name) OR number (index)
*/
export interface IWorkflowStepQuery{
  ():Partial<IWorkflowStep>|number|string;
}
/** defined options to expose transition direction constanst */
export class TransitionDirection{
  static GO:WorkflowDirection="go";
  static PREVIOUS:WorkflowDirection="previous";
  static NEXT:WorkflowDirection="next";
}
/** The 'direction' that workflow steps can occur */
export type WorkflowDirection="go"|"next"|"previous";
/**
 * Allows to piggy back contextual information onto workflow transitions
 */
export interface IWorkflowTransitionContext{
}

/** Defines the signature of the delegate that will do a deferred retrieval of the workflow */
export interface IWorkflowLocator {
  (): IWorkflow
}
/** Defines the signature of the delegate that will do a deferred retrieval of the workflow */
export interface IworkflowStepLocator {
  (): IWorkflowStep
}
/** Defines a generic callback signature */
export interface ICallback
{
  (options?:any):any;
}
/** When workflows transition from one step to the next, it is possible to subscribe to these transitions.
 * This contract defines the shape of that transition
 */
export interface IWorkflowTransition
{
  readonly from?:IWorkflowStep;
  to?:IWorkflowStep;
  continue:boolean;
  context?:IWorkflowTransitionContext;
  direction:WorkflowDirection;
}

/** Defines the shape of the options used o initialize a workflow  */
export interface IWorkflowOptions {
  /** The steps that will be initialized */
  steps(): Array<Partial<IWorkflowStep>>;
  /** The delegate that returns a workflow step query */
  firstStep?:IWorkflowStepQuery;
  cancel?:ICallback;
  finish?:ICallback;
}
/** Defines the IWorkflow contract */
export interface IWorkflow {
  /** Initializes|reinitializes the workflow steps */
  initialize(options:IWorkflowOptions);
  /** Gets or sets the list of workflow steps */
  steps: Array<Partial<IWorkflowStep>>;
  /** Gets or sets the active step */
  activeStep: IWorkflowStep;
  /** Checks if the parametrically specified step is active */
  isStepActive(step: number | string | Partial<IWorkflowStep>): boolean;
  /** parametrically activates the specified step but does not keep track the previous step */
  gotoStep(step: number | string | Partial<IWorkflowStep>,context?:IWorkflowTransitionContext): IWorkflowStep;
  /** activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * and records the current step as the previous step */
  gotoNextStep(step?: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Activates the previous step but only if there is one to activate */
  gotoPreviousStep(): IWorkflowStep;
  /** Find the step parametrically defined */
  findStep(step: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** retrieves the first step */
  firstStep():IWorkflowStep;
  /** workflow cancel handler */
  cancel(options:any):any;
  /** workflow finish handler */
  finish(options:any):any;
  /** workflow reset handler */
  reset(options:any):any;
  /** a way to subscribe to workflow transitions and prevent them from occuring or to redirect the next step */
  transitions:Observable<IWorkflowTransition>;
}
/** Defines the IWorkflowStep contract */
export interface IWorkflowStep {
  /** tne name of the step */
  name: string
  /** the positional index of the step */
  index: number;
  /** the positional index of the next step */
  nextIndex: number;
  /** Checks if this step is active or not. */
  isActive(): boolean;
  /** Activates this step if it is in the workflow steps collection. */
  activate():IWorkflowStep;
  /** Activates the parametrically specified step, and DOES NOT record the current step as the previous step. */
  gotoStep(step: number | string | Partial<IWorkflowStep>,context?:IWorkflowTransitionContext): IWorkflowStep;
  /** activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * and DOES record the current step as the previous step (in contrast to gotoStep wich DOES NOT) */
  gotoNextStep(step?: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Activates the previous step but if there is a previous step. */
  gotoPreviousStep(): IWorkflowStep
  /** Retrieves the next step if it is in the steps collection but does not activate it. */
  getNextStep(): IWorkflowStep;
  /** The owning workflow */
  workflow:IWorkflow
}
