

/** Defines the signature of the delegate that will do a deferred retrieval a wizard step query
 * the return type of the delegate is a partial wizardstep OR string (name) OR number (index)
*/
export interface IWizardStepQuery{
  ():Partial<IWizardStep>|number|string;
}

/** Defines the signature of the delegate that will do a deferred retrieval of the wizard */
export interface IWizardLocator {
  (): IWizard
}

/** Defines the shape of the options used o initialize a wizard  */
export interface IWizardOptions {
  /** The steps that will be initialized */
  steps(): Array<Partial<IWizardStep>>;
  /** The delegate that returns a wizard step query */
  firstStep?:IWizardStepQuery;
}
/** Defines the IWizard contract */
export interface IWizard {
  /** Initializes|reinitializes the wizard steps */
  initialize(options:IWizardOptions);
  /** Gets or sets the list od wizard steps */
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
  /** Activates the previous step but only if there is one to activate */
  gotoPreviousStep(): IWizardStep;
  /** Find the step parametrically defined */
  findStep(step: number | string | Partial<IWizardStep>): IWizardStep;
  /** retrieves the first step */
  firstStep():IWizardStep;
}
/** Defines the IWizardStep contract */
export interface IWizardStep {
  /** tne name of the step */
  name: string
  /** the positional index of the step */
  index: number;
  /** the positional index of the next step */
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
  /** The owning wizard */
  wizard:IWizard
}
