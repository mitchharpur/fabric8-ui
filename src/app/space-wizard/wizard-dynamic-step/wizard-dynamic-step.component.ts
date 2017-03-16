import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, SimpleChange, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { IWizardStep, IWizardStepTransition, IWizard, StepDirection } from '../domain/wizard';
import { getLogger, ILog } from '../domain/logger';
import { IFieldSetService, IFieldSetServiceProvider } from '../services/field-set.service'




@Component({
  host: {
    'class': 'wizard-step'
  },
  selector: 'wizard-dynamic-step',
  templateUrl: './wizard-dynamic-step.component.html',
  styleUrls: ['./wizard-dynamic-step.component.scss'],
  providers: [IFieldSetServiceProvider.FactoryProvider]

})
export class WizardDynamicStepComponent implements OnInit, OnDestroy, OnChanges {

  // keep track of the number of instances
  static instanceCount: number = 0;
  private _instance: number = 0;
  /** adds a log entry to the logger */
  private log: ILog = () => { };

  private _wizard: IWizard
  @Input()
  get wizard(): IWizard {
    return this._wizard
  }
  set wizard(value: IWizard) {
    this._wizard = value;
  }

  @Input() stepName: string = "";

  constructor( @Inject(IFieldSetServiceProvider.InjectToken) private _fieldSetService: IFieldSetService) {
    WizardDynamicStepComponent.instanceCount++;
    this._instance = WizardDynamicStepComponent.instanceCount;
    //get a logger
    this.log = getLogger(this.constructor.name, this._instance);
    this.log({ message: "Creating an instance.", info: true });
    if (!this._fieldSetService) {
      this.log({ message: "A null instance of IFieldSetService was injected ...", warn: true });
    }
  }

  /** At this point all inputs are bound and values assigned, but the wizard get a new instance every time the dilog is made visible */
  ngOnInit() {
    this.log(`ngOnInit.`)
    //this.subscribeToWizardTransitions(this.wizard);
  }

  ngOnDestroy() {
    this.log(`ngOnDestory.`)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.log(`ngOnChanges.`)
    this.onWizardPropertyChanged(changes["wizard"]);
  }


  private subscribeToWizardTransitions(wizard: IWizard) {
    if(!wizard)
    {
      return;
    }
    this.log(`Subscribing to wizard transitions in order to observe any step transitions.`);
    wizard.transitions.subscribe((transition) => {
      try {
        this.log({ message: `Subscriber responding to an observed '${transition.context.direction}' transition: from ${transition.from ? transition.from.name : "null"} to ${transition.to ? transition.to.name : "null"}.` });
        if (transition.to && transition.to.name.toLowerCase() === this.stepName.toLowerCase()) {
          //only get fields on next operations
          switch (transition.context.direction) {
            case StepDirection.NEXT:
              {
                if (transition.from != transition.to) {
                  //handle first fieldset
                  this._fieldSetService.FirstFieldSet.subscribe((fieldSet) => {
                    this.log(`retrieved first set of fields ...`)
                  })
                }
                else {
                  //handle subsequent fieldsets
                  this._fieldSetService.NextFieldSet.subscribe((fieldSet) => {
                    this.log(`retrieved next set of fields ...`)
                  })
                }
                break;
              }
            case StepDirection.PREVIOUS:
              {
                this.log(`field rollback ...`)
                break;
              }
          }
        }
      }
      catch (err) {
        this.log({ message: err.message, error: true, inner: err });
      }
    })
  }

  private onWizardPropertyChanged(change?: SimpleChange) {
    if (change) {
      this.log(`The wizard property changed value ...`);
      if (change.currentValue !== change.previousValue) {
          let prev:IWizard=change.previousValue;
          let current:IWizard=change.currentValue;
          this.subscribeToWizardTransitions(current);
      }
    }

  }




}
