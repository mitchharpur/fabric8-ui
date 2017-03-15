import { Observable,  Subscriber,Subject } from 'rxjs/Rx';

import { IWizardStep, IWizardStepTransition, IWizard, IWizardLocator, IWizardOptions } from './wizard'


/** allows intercepting of wizard step transitions  */
class WizardStepTransition implements IWizardStepTransition {
  constructor(options:Partial<IWizardStepTransition>={from:null,to:null,enabled:true}){
    Object.assign(this,options);
  }
  from?:IWizardStep;
  to?:IWizardStep;
  enabled:boolean=true;
}

/** implementation of the wizardstep */
export class WizardStep implements IWizardStep {



  index: number = 0;
  name: string = "";
  nextIndex: number;

  constructor(options: Partial<IWizardStep>, private wizardLocator: IWizardLocator) {
    Object.assign(this, options);
  }

  gotoNextStep(step?: number | string | Partial<IWizardStep>) {
    return this.wizardLocator().gotoNextStep(step);
  }

  gotoPreviousStep() {
    return null;
  }

  isActive() {
    return this.wizardLocator().isStepActive(this);
  }

  activate() {
    this.wizardLocator().gotoStep(this);
    return this;
  }

  gotoStep(destination: number | string | IWizardStep) {
    let step: IWizardStep = null;
    if (this.isActive) {
      //you can only goto a step if 'this' is the active step
      step = this.wizardLocator().gotoStep(destination);
    }
    return step;
  }

  getNextStep() {
    let step = this.wizardLocator().findStep(this.nextIndex);
    return step;
  }

  get wizard() {
    return this.wizardLocator();
  }

  set wizard(value:IWizard)
  {
  }

}

/** Implementation of the wizard contract */
export class Wizard implements IWizard {

  static Create():IWizard{
    return new Wizard();
  }

  private _steps: Array<IWizardStep> = [];

  private _activeStep: IWizardStep

  constructor() {
  }

  get steps(): Array<IWizardStep> {
    return this._steps;
  };

  set steps(value: Array<IWizardStep>) {
    this.initialize({ steps: () => value });
  }

  /** default cancel handler */
  cancel(options:any):any{
      return null;
  }
  /** default finish handler */
  finish(options:any):any{
      return null;
  }
  /** default reset handler */
  reset(options:any):any{
      return null;
  }

  firstStep(): IWizardStep {
    // The default first step handler is null ... it gets overriden during intialization.
    return null;
  }

  get activeStep(): IWizardStep {
    return this._activeStep;
  };

  set activeStep(value: IWizardStep) {
    console.info(`wizard: Setting active wizard step from ${this._activeStep ? this._activeStep.name : 'null'} to ${value ? value.name : 'null'} `);
    this._activeStep = value;
  }

  initialize(options: IWizardOptions) {
    console.log("wizard: Initializing wizard ...")
    let wizard = this;
    this._steps = [];
    //ensure callback have correct 'this'
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
      let step = new WizardStep(item, () => wizard);
      this._steps.push(step);
    }
    //Set up the 'first step' handler/closure that will dynamically use index or
    //the IWizardStepQuery optionally passed in with wizard options;
    this.firstStep = () => {
      let firstStep: IWizardStep = null;
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
    //now set active step to firstStep
    this.activeStep = this.firstStep();
    if(options.cancel)
    {
      this.cancel=(...args)=>{
          var timer=setTimeout(()=>{
          clearTimeout(timer);
          console.log("wizard: invoking cancel ... ");
          options.cancel.apply(wizard,args);
        },10);
      }
      return true;
    }
    if(options.finish)
    {
      this.finish=(...args)=>{
          var timer=setTimeout(()=>{
          clearTimeout(timer);
          console.log("wizard: invoking finish ... ");
          options.finish.apply(wizard,args);
        },10)
      }
    }
  }

  isStepActive(step: number | string | Partial<IWizardStep>) {
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

  findStep(destination: number | string | Partial<IWizardStep>) {
    let step: IWizardStep = null;
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

  gotoStep(destination: number | string | Partial<IWizardStep>) {

    let destinationStep = this.findStep(destination);
    if (destinationStep) {
      if(this.isStepTransitionEnabled({from:this.activeStep,to:destinationStep}))
      {
        let activeStep = this.activeStep;
        this.activeStep = destinationStep;
      }
    }
    return destinationStep;
  }

  gotoNextStep(destination?: number | string | Partial<IWizardStep>) {
    console.log(`wizard: gotoNextStep ...`)
    let nextStep: IWizardStep = null;
    let activeStep = this.activeStep;
    if (!destination) {
      // if nothing specified (i.e no branching) then just do the default behavior based on nextIndex
      if (activeStep) {
        nextStep = this.findStep(activeStep.nextIndex);
        console.log(`wizard: found next step = ${nextStep.name} ...`);
      }
      else {
        //if no active step then the firstStep is the next step
        this.activeStep = this.firstStep();
        console.log(`wizard: found next step = ${this.activeStep.name} ...`);
        return this.activeStep;
      }
    }
    else {
      // otherwise 'branch' to specified step
      nextStep = this.findStep(destination);
      console.log(`wizard: found next step = ${nextStep.name} ...`);
    }
    if (!nextStep) {
      let currentStep = "";
      if (this.activeStep) {
        currentStep = ` for ${this.activeStep.name}`;
      }
      console.warn(`wizard: gotoNextStep ... no next step  for step=${currentStep} ...`);
    }
    // setup the previous step handler and transition to nextstep if the step is valid
    if (nextStep) {
        let priorHandler = nextStep.gotoPreviousStep;
        // by dynamically adding the gotoNextStep function using a closure to retriev previous step
        nextStep.gotoPreviousStep = () => {
          let step = this.gotoStep(activeStep);
          // restore prior handler
          nextStep.gotoPreviousStep = priorHandler;
          return step;
        }
        this.gotoStep(nextStep.index)
    }
    return nextStep;
  }

  gotoPreviousStep() {
    console.log(`wizard: gotoPreviousStep ...`)
    let wizard = this;
    let previousStep = null
    let currentActiveStep = this.activeStep;
    if (currentActiveStep.gotoPreviousStep) {
      previousStep = currentActiveStep.gotoPreviousStep()
    }
    return previousStep;
  }

  private isStepTransitionEnabled(options:Partial<IWizardStepTransition>={enabled:true}):boolean{
     let transition=new WizardStepTransition(options);
     this.subject.next(transition);
     if(transition.from===transition.to)
     {
        transition.enabled=false;
     }
     console.log(`IsStepTransition enabled=${transition.enabled}`);
     return transition.enabled;
  }

  private subject:Subject<IWizardStepTransition>=new Subject<IWizardStepTransition>();
  //every subscriber gets an observable
  get Transitions():Observable<IWizardStepTransition>{
      let me=this;
      let transitions:Observable<IWizardStepTransition>=Observable.create(observer=>{
          me.subject.subscribe(observer);
      });
      return transitions;
  }
};



