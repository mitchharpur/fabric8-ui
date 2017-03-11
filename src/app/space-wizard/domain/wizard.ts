
export interface IWizardStep {
  name: string
  index: number;
  nextIndex: number;
  /** Checks if this step is active or not. */
  isActive(): boolean;
  /** Activates this step if it is in the wizard steps collection. */
  activate():IWizardStep;
  /** Activates the parametrically specified step, and DOES NOT record the current step as the previous step. */
  gotoStep(step: number | string | Partial<IWizardStep>): IWizardStep;
  /** activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * and records the current step as the previous step */
  gotoNextStep(step?: number | string | Partial<IWizardStep>): IWizardStep;
  /** Activates the previous step but if there is one. */
  gotoPreviousStep(): IWizardStep
  /** Retrieves the next step if it is in the steps collection but does not activate it. */
  getNextStep(): IWizardStep;
}

export interface IFirstStep{
  ():Partial<IWizardStep>|number|string;
}

export interface IWizardOptions {
  steps(): Array<Partial<IWizardStep>>;
  firstStep?:IFirstStep;
}

export interface IWizard {
  initialize(options:IWizardOptions);
  steps: Array<Partial<IWizardStep>>;
  /** Gets or sets the active step */
  activeStep: IWizardStep;
  /** Checks if the parametrically specified step is active */
  isStepActive(step: number | string | Partial<IWizardStep>): boolean;
  /** parametrically activates the specified step but does not keep track the previous step */
  gotoStep(step: number | string | Partial<IWizardStep>): IWizardStep;
  /** activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * and records the current step as the previous step */
  gotoNextStep(step?: number | string | Partial<IWizardStep>): IWizardStep;
  /** activates the previous step but only if there is one */
  gotoPreviousStep(): IWizardStep;
  /** Find the step parametrically defined */
  findStep(step: number | string | Partial<IWizardStep>): IWizardStep;
  /** retrieves the first step */
  firstStep():IWizardStep;
}
/** defines an anonymous function to retrieve the wizard */
export interface IWizardLocator {
  (): IWizard
}
/** implementation of the wizardstep */
export class WizardStep implements IWizardStep {

  index: number = 0;
  name: string = "";
  nextIndex: number;

  constructor(options: Partial<IWizardStep>, private wizardLocator: IWizardLocator) {
    Object.assign(this,options);
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
  activate()
  {
    this.wizardLocator().gotoStep(this);
    return this;
  }
  gotoStep(destination: number | string | IWizardStep) {
    let step: IWizardStep = null;
    if (this.isActive) {
      //you can only goto a step if this is the active step
      step = this.wizardLocator().gotoStep(destination);
    }
    return step;
  }
  getNextStep() {
    let step = this.wizardLocator().findStep(this.nextIndex);
    return step;
  }

}


/** implementation of the wizard */
export class Wizard implements IWizard {

  private _steps: Array<IWizardStep> = [];
  private _activeStep:IWizardStep

  constructor() {
  }

  get steps(): Array<IWizardStep> {
    return this._steps;
  };

  set steps(value: Array<IWizardStep>) {
    this.initialize({steps:()=>value});
  }

  firstStep():IWizardStep{
      return null;
  }
  get activeStep(): IWizardStep{
    return this._activeStep;
  };

  set activeStep(value:IWizardStep)
  {
    console.info(`wizard: Setting active wizard step from ${this._activeStep?this._activeStep.name:'null'} to ${value?value.name:'null'} ` );
    this._activeStep=value;
  }

  initialize(options: IWizardOptions) {
    console.log("wizard: Initializing wizard ...")
    let wizard = this;
    this._steps = [];
    let items=options.steps()||[];
    items=items.sort((i)=>{ return i.index;});

    let firstIndex:number=0;
    if(items.length>0)
    {
      firstIndex=items[0].index;
    }
    // insert items
    for (let item of items) {
      if(item.index && item.index<firstIndex)
      {
        firstIndex=item.index
      }
      let step = new WizardStep(item,() =>wizard);
      this._steps.push(step);
    }
    //set up first step handler/closure that will dynamically use index or
    //the first handler passed in with options;
    this.firstStep=()=>
    {
      let firstStep:IWizardStep=null;
      if(!options.firstStep)
      {
        options.firstStep=()=>firstIndex;
      }
      let first=options.firstStep();
      firstStep=wizard.findStep(first);
      if(!firstStep)
      {
        firstStep=wizard.findStep(firstIndex);
      }
      return firstStep;
    }
    //now set active step to firstStep
    this.activeStep=this.firstStep();
  }

  isStepActive(step: number | string | Partial<IWizardStep>) {
    if (this.activeStep) {
      if(step===this.findStep)
      {
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
      let activeStep = this.activeStep;
      this.activeStep = destinationStep;
    }
    return destinationStep;
  }

  gotoNextStep(destination?: number | string | Partial<IWizardStep>) {
    console.log(`wizard: gotoNextStep ...`)
    let nextStep:IWizardStep = null;
    let activeStep = this.activeStep;
    if (!destination) {
      // if nothing specified (i.e no branching) then just do the default behavior based on nextIndex
      if(activeStep)
      {
        nextStep = this.findStep(activeStep.nextIndex);
        console.log(`wizard: found next step =${ nextStep.name} ...`);
      }
      else
      {
        //if no active step then the firstStep is the next step
        this.activeStep=this.firstStep();
        console.log(`wizard: found next step =${ this.activeStep.name} ...`);
        return this.activeStep;
      }
    }
    else {
      // otherwise 'branch' to specified step
      nextStep = this.findStep(destination);
        console.log(`wizard: found next step =${ nextStep.name} ...`);
    }
    if(!nextStep)
    {
      let currentStep="";
      if(this.activeStep)
      {
        currentStep=` for ${this.activeStep.name}`;
      }
      console.warn(`wizard: gotoNextStep ... no next step found ${currentStep} ...`);
    }
    // setup the previous step handler
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
};



