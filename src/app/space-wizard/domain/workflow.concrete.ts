import { Observable, Observer, Subscriber, Subject } from 'rxjs/Rx';

import { IWorkflowStep, IWorkflowTransition, IWorkflowTransitionContext, IWorkflow, IWorkflowLocator, IWorkflowOptions, WorkflowDirection, TransitionDirection } from './workflow'

import { getLogger, ILoggerDelegate } from './logger';


export class WorkflowFactory
{
  static Create(options?: IWorkflowOptions):IWorkflow{
    let tmp=new Workflow();
    if(options)
    {
      tmp.initialize(options);
    }
    return tmp;
  }
}


/** allows intercepting of workflow transitions  */
class WorkflowTransition implements IWorkflowTransition {
  constructor(options: Partial<IWorkflowTransition> = { from: null, to: null, continue: true,direction: TransitionDirection.GO,context: {  } }) {
    this.context = { };
    this.continue = true;
    this.direction = TransitionDirection.GO;
    Object.assign(this, options);
  }
  from?: IWorkflowStep;
  to?: IWorkflowStep;
  context: IWorkflowTransitionContext
  continue: boolean = false;
  direction:WorkflowDirection;
}

/** implementation of the IWorkflowstep */
export class WorkflowStep implements IWorkflowStep {


  index: number = 0;
  name: string = "";
  nextIndex: number;

  constructor(options: Partial<IWorkflowStep>, private workflowLocator: IWorkflowLocator) {
    Object.assign(this, options);
  }

  gotoNextStep(step?: number | string | Partial<IWorkflowStep>) {
    return this.workflowLocator().gotoNextStep(step);
  }

  gotoPreviousStep() {
    return null;
  }

  isActive() {
    return this.workflowLocator().isStepActive(this);
  }

  activate() {
    this.workflowLocator().gotoStep(this);
    return this;
  }

  gotoStep(destination: number | string | IWorkflowStep, context: IWorkflowTransitionContext = { direction: TransitionDirection.GO }) {
    let step: IWorkflowStep = null;
    if (this.isActive) {
      //you can only goto a step if 'this' is the active step
      step = this.workflowLocator().gotoStep(destination, context);
    }
    return step;
  }

  getNextStep() {
    let step = this.workflowLocator().findStep(this.nextIndex);
    return step;
  }

  get wizard() {
    return this.workflowLocator();
  }

  set wizard(value: IWorkflow) {
  }

}

/** Implementation of the wizard contract */
export class Workflow implements IWorkflow {

  static instanceCount: number = 0;

  private _instance: number = 0;
  private _steps: Array<IWorkflowStep> = [];
  private _workflowTransitionSubject: Subject<IWorkflowTransition>;
  private _activeStep: IWorkflowStep

  private log: ILoggerDelegate = () => { };


  constructor() {
    Workflow.instanceCount++;
    this._instance = Workflow.instanceCount;
    this.log = getLogger(this.constructor.name, this._instance);
    this.log(`New instance...`);
  }

  get steps(): Array<IWorkflowStep> {
    return this._steps;
  };

  set steps(value: Array<IWorkflowStep>) {
    this.initialize({ steps: () => value });
  }

  /** default cancel handler */
  cancel(options: any): any {
    return null;
  }
  /** default finish handler */
  finish(options: any): any {
    return null;
  }
  /** default reset handler */
  reset(options: any): any {
    return null;
  }

  firstStep(): IWorkflowStep {
    // The default first step handler is null ... it gets overriden during intialization.
    return null;
  }

  get activeStep(): IWorkflowStep {
    return this._activeStep;
  };

  set activeStep(value: IWorkflowStep) {
    this.log(`Setting the active workflow step from '${this._activeStep ? this._activeStep.name : 'null'}' to '${value ? value.name : 'null'}' `);
    this._activeStep = value;
  }

  initialize(options: IWorkflowOptions) {
    this.log("Initializing the workflow ...")
    let wizard = this;
    this._steps = [];
    // ensure callback have correct 'this'
    let items = options.steps.apply(wizard) || [];
    // first sort by index
    items = items.sort((i) => { return i.index; });
    // retrieve the default first item, i.e the one with the lowest index.
    let firstIndex: number = 0;
    if (items.length > 0) {
      firstIndex = items[0].index;
    }
    // then insert items
    for (let item of items) {
      if (item.index && item.index < firstIndex) {
        firstIndex = item.index
      }
      let step = new WorkflowStep(item, () => wizard);
      this._steps.push(step);
    }
    // Set up the 'first step' handler/closure that will dynamically use index or
    // the IWizardStepQuery optionally passed in with wizard options;
    this.firstStep = () => {
      let firstStep: IWorkflowStep = null;
      if (!options.firstStep) {
        options.firstStep = () => firstIndex;
      }
      let first = options.firstStep();
      firstStep = wizard.findStep(first);
      if (!firstStep) {
        firstStep = wizard.findStep(firstIndex);
      }
      return firstStep;
    }
    // now set active step to firstStep
    this.activeStep = this.firstStep();
    if (options.cancel) {
      this.cancel = (...args) => {
        var timer = setTimeout(() => {
          clearTimeout(timer);
          this.log("Invoking cancel ... ");
          options.cancel.apply(wizard, args);
        }, 10);
      }
      return true;
    }
    if (options.finish) {
      this.finish = (...args) => {
        var timer = setTimeout(() => {
          clearTimeout(timer);
          this.log("Invoking finish ... ");
          options.finish.apply(wizard, args);
        }, 10)
      }
    }
  }

  isStepActive(step: number | string | Partial<IWorkflowStep>) {
    if (this.activeStep) {
      if (step === this.findStep) {
        // check for reference
        return true;
      }
      if (typeof step === 'number') {
        // check by number
        return step === this.activeStep.index;
      }
      else if (typeof step === 'string') {
        // check by name
        return step.toLowerCase() === this.activeStep.name.toLowerCase();
      }
      else {
        //check by partial
        if (step.index !== null && step.index != undefined) {
          // check by partial.number
          return step === this.activeStep.index;
        }
        else if (step.name) {
          // check by partial.name
          return step.name.toLowerCase() === this.activeStep.name.toLowerCase();
        }
      }
    }
    return false;
  }

  findStep(destination: number | string | Partial<IWorkflowStep>) {
    let step: IWorkflowStep = null;
    if (typeof destination === 'number') {
      step = this.steps.find((step) => step.index === destination)
      return step;
    }
    else if (typeof destination === 'string') {
      step = this.steps.find((step) => step.name.toLowerCase() === destination.toLowerCase())
      return step;
    }
    else {
      if (destination.index !== null && destination.index != undefined) {
        step = this.steps.find((s) => s.index === destination.index)
        return step;
      }
      else if (destination.name) {
        step = this.steps.find((s) => s.name.toLowerCase() === destination.name.toLowerCase())
      }
    }
    return step;
  }
  //TODO: convert to promise for async long running transiitions
  gotoStep(destination: number | string | Partial<IWorkflowStep>, transitionOptions: Partial<IWorkflowTransition> = { continue:true, direction: TransitionDirection.GO,context:{} }) {

    let destinationStep = this.findStep(destination);
    if (destinationStep) {
      transitionOptions.continue=transitionOptions.continue||true;
      transitionOptions.direction=transitionOptions.direction||TransitionDirection.GO;
      transitionOptions.context=transitionOptions.context||{};
      if (this.workflowTransitionShouldContinue({ from: this.activeStep, to: destinationStep, direction:transitionOptions.direction ,continue:transitionOptions.continue,context:transitionOptions.context }) === true) {
        let activeStep = this.activeStep;
        this.activeStep = destinationStep;
      }
    }
    return destinationStep;
  }

  gotoNextStep(destination?: number | string | Partial<IWorkflowStep>) {
    this.log(`gotoNextStep ...`)
    let nextStep: IWorkflowStep = null;
    let activeStep = this.activeStep;
    if (!destination) {
      // if nothing specified (i.e no branching) then just do the default behavior based on nextIndex
      if (activeStep) {
        nextStep = this.findStep(activeStep.nextIndex);
        this.log(`Found next step = ${nextStep.name} ...`);
      }
      else {
        // if no active step then the firstStep is the next step
        this.activeStep = this.firstStep();
        this.log(`Found next step = ${this.activeStep.name} ...`);
        return this.activeStep;
      }
    }
    else {
      // otherwise 'branch' to specified step
      nextStep = this.findStep(destination);
      this.log(`Found next step = ${nextStep.name} ...`);
    }
    if (!nextStep) {
      let currentStep = "";
      if (this.activeStep) {
        currentStep = ` for ${this.activeStep.name}`;
      }
      this.log(`gotoNextStep ... no next step for the current step = ${currentStep} ...`);
    }
    // setup the previous step handler and transition to nextstep if the step is valid
    if (nextStep) {
      let priorHandler = nextStep.gotoPreviousStep;
      // by dynamically adding the gotoNextStep function using a closure to retrieve previous step
      nextStep.gotoPreviousStep = () => {
        let step = this.gotoStep(activeStep, { continue:true, direction: TransitionDirection.PREVIOUS });
        // restore prior handler
        nextStep.gotoPreviousStep = priorHandler;
        return step;
      }
      this.gotoStep(nextStep.index, { continue:true, direction: TransitionDirection.NEXT,context:{} })
    }
    return nextStep;
  }

  gotoPreviousStep() {
    this.log(`gotoPreviousStep ...`)
    let wizard = this;
    let previousStep = null
    let currentActiveStep = this.activeStep;
    if (currentActiveStep.gotoPreviousStep) {
      previousStep = currentActiveStep.gotoPreviousStep()
    }
    return previousStep;
  }
  //TODO needs to return a promise to cater for async step continuation
  private workflowTransitionShouldContinue(options: Partial<IWorkflowTransition> = { continue: false, context: { direction: TransitionDirection.GO } }): boolean {
    let transition = new WorkflowTransition(options);
    this.log(`Notify workflow transition subscribers of an upcoming '${transition.direction}' transition from '${transition.from?transition.from.name:"null"}' to '${transition.to?transition.to.name:"null"}' `);
    this.workflowTransitionSubject.next(transition);
    this.log(`workflowTransitionShouldContinue = ${transition.continue}`);
    if(transition.continue===false)
    {
      this.log({message:`Note: workflow will not proceed from '${transition.from?transition.from.name:"null"}' to '${transition.to?transition.to.name:"null"}' because transition.continue=${transition.continue}`,warning:true});

    }
    return transition.continue;
  }

  get workflowTransitionSubject(): Subject<IWorkflowTransition> {
    this._workflowTransitionSubject = this._workflowTransitionSubject || new Subject<IWorkflowTransition>();
    return this._workflowTransitionSubject;
  }
  set workflowTransitionSubject(value: Subject<IWorkflowTransition>) {
    this._workflowTransitionSubject = value;
  }

  //Note: every subscriber gets an observable instance
  get transitions(): Observable<IWorkflowTransition> {
    let me = this;
    let transitions: Observable<IWorkflowTransition> = Observable.create((observer: Observer<IWorkflowTransition>) => {
      me.workflowTransitionSubject.subscribe(observer)
      this.log("Observer is now subscribed to workflow transitions ...");

    });
    return transitions;
  }
};



