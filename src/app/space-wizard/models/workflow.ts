import { Observable,  Subscriber } from 'rxjs/Rx';

/**
 * Creates concrete implementations of the IWorkflow contract
 * */
export { WorkflowFactory} from './workflow.concrete';

/**
 * Defines the signature of the delegate that will do a deferred retrieval a workflow step query.
 * The return type of the delegate is a partial workflowstep OR string (name) OR number (index)
*/
export interface IWorkflowStepQuery{
  ():Partial<IWorkflowStep>|number|string;
}
/**
 * Defined options to expose transition direction constants for ease of use
 * */
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

/**
 * Defines the signature of the delegate that will do a deferred retrieval of the workflow
 * */
export interface IWorkflowLocator {
  (): IWorkflow
}
/**
 * Defines the signature of the delegate that will do a deferred retrieval of the workflow
 * */
export interface IworkflowStepLocator {
  (): IWorkflowStep
}
/**
 * Defines a generic callback signature
 * */
export interface ICallback
{
  (options?:any):any;
}
/**
 * When workflows transition from one step to the next, it is possible to subscribe to these transitions.
 * This contract defines the shape of that transition
 */
export interface IWorkflowTransition
{
  /** The workflow step that is being transitioned from */
  readonly from?:IWorkflowStep;
  /** The workflow step that is being transitioned to */
  to?:IWorkflowStep;
  /** Boolean indicating if the transition should continue or not */
  continue:boolean;
  /** Misc contextual information */
  context?:IWorkflowTransitionContext;
  /** The workflow direction in which the transition is being made */
  direction:WorkflowDirection;
}

/**
 * Defines the shape of the options used to initialize a workflow
 * */
export interface IWorkflowOptions {
  /** The steps that will be initialized */
  steps(): Array<Partial<IWorkflowStep>>;
  /** The delegate that returns a workflow step query */
  firstStep?:IWorkflowStepQuery;
  /** The generic callback to call on workflow cancel  */
  cancel?:ICallback;
  /** The generic callback to call on workflow finish  */
  finish?:ICallback;
}
/**
 * Defines the IWorkflow contract
 * */
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
  /** Retrieves the first step */
  firstStep():IWorkflowStep;
  /** Workflow cancel handler */
  cancel(options:any):any;
  /** Workflow finish handler */
  finish(options:any):any;
  /** Workflow reset handler */
  reset(options:any):any;
  /** Observable as a way to subscribe to workflow transitions and as well as prevent transitions from occuring or to redirect the next workflow step */
  transitions:Observable<IWorkflowTransition>;
}
/**
 * Defines the IWorkflowStep contract
 * */
export interface IWorkflowStep {
  /** The name of the step */
  name: string
  /** Ihe positional index of the step */
  index: number;
  /** Ihe positional index of the next step */
  nextIndex: number;
  /** Checks if this step is active or not. */
  isActive(): boolean;
  /** Activates this step if it is in the workflow steps collection. */
  activate():IWorkflowStep;
  /** Activates the parametrically specified step, and DOES NOT record the current step as the previous step. */
  gotoStep(step: number | string | Partial<IWorkflowStep>,context?:IWorkflowTransitionContext): IWorkflowStep;
  /** Activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * It DOES record the current step as the previous step (in contrast to gotoStep which DOES NOT) */
  gotoNextStep(step?: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Activates the previous step but only if there is a previous step to activate */
  gotoPreviousStep(): IWorkflowStep
  /** Retrieves the next step if it is in the steps collection but does not activate it. */
  getNextStep(): IWorkflowStep;
  /** The owning workflow */
  workflow:IWorkflow
}
