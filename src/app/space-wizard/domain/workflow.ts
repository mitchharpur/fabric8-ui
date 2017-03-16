import { Observable,  Subscriber } from 'rxjs/Rx';

/** creates concrete implementations of the IWizard contract */
export { WorkflowFactory} from './workflow.concrete';

/** Defines the signature of the delegate that will do a deferred retrieval a wizard step query
 * the return type of the delegate is a partial wizardstep OR string (name) OR number (index)
*/
export interface IWizardStepQuery{
  ():Partial<IWorkflowStep>|number|string;
}

export class TransitionDirection{
  static GO:WorkflowDirection="go";
  static PREVIOUS:WorkflowDirection="previous";
  static NEXT:WorkflowDirection="next";
}

export type WorkflowDirection="go"|"next"|"previous";

export interface IWorkflowTransitionContext{
}

/** Defines the signature of the delegate that will do a deferred retrieval of the wizard */
export interface IWorkflowLocator {
  (): IWorkflow
}
/** Defines the signature of the delegate that will do a deferred retrieval of the wizard */
export interface IWizardStepLocator {
  (): IWorkflowStep
}

export interface ICallback
{
  (options?:any):any;
}

export interface IWorkflowTransition
{
  readonly from?:IWorkflowStep;
  to?:IWorkflowStep;
  continue:boolean;
  context?:IWorkflowTransitionContext;
  direction:WorkflowDirection;
}

/** Defines the shape of the options used o initialize a wizard  */
export interface IWorkflowOptions {
  /** The steps that will be initialized */
  steps(): Array<Partial<IWorkflowStep>>;
  /** The delegate that returns a wizard step query */
  firstStep?:IWizardStepQuery;
  cancel?:ICallback;
  finish?:ICallback;
}
/** Defines the IWizard contract */
export interface IWorkflow {
  /** Initializes|reinitializes the wizard steps */
  initialize(options:IWorkflowOptions);
  /** Gets or sets the list od wizard steps */
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
  /** wizard cancel handler */
  cancel(options:any):any;
  /** wizard finish handler */
  finish(options:any):any;
  /** wizard reset handler */
  reset(options:any):any;
  /** a way to subscribe to step transitions and prevent them from occuring or to redirect the next step */
  transitions:Observable<IWorkflowTransition>;
}
/** Defines the IWizardStep contract */
export interface IWorkflowStep {
  /** tne name of the step */
  name: string
  /** the positional index of the step */
  index: number;
  /** the positional index of the next step */
  nextIndex: number;
  /** Checks if this step is active or not. */
  isActive(): boolean;
  /** Activates this step if it is in the wizard steps collection. */
  activate():IWorkflowStep;
  /** Activates the parametrically specified step, and DOES NOT record the current step as the previous step. */
  gotoStep(step: number | string | Partial<IWorkflowStep>,context?:IWorkflowTransitionContext): IWorkflowStep;
  /** activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * and records the current step as the previous step */
  gotoNextStep(step?: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Activates the previous step but if there is one. */
  gotoPreviousStep(): IWorkflowStep
  /** Retrieves the next step if it is in the steps collection but does not activate it. */
  getNextStep(): IWorkflowStep;
  /** The owning wizard */
  wizard:IWorkflow
}
