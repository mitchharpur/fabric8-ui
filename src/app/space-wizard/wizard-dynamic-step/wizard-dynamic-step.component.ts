import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { IWizardStep, IWizardStepTransition, IWizard } from '../domain/wizard';
//import { Wizard } from '../domain/wizard-implementation';

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
export class WizardDynamicStepComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 0;

  @Input() wizard: IWizard;

  constructor( @Inject(IFieldSetServiceProvider.InjectToken) private _fieldSetService: IFieldSetService) {
    WizardDynamicStepComponent.instanceCount++;
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : creating instance`);
    if(!this._fieldSetService)
    {
      console.warn("a null instance of OFieldSetService was injected...");
    }
  }

  getWizardTransitionHandler(service:IFieldSetService)
  {
    return (transition: IWizardStepTransition)=> {
      console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : Subscribed to transition: from ${transition.from ? transition.from.name : "null"} to ${transition.from ? transition.from.name : "null"}`)
      try{
        if (transition.to && transition.to.name.toLowerCase() === "dynamic-step") {
          if (transition.from != transition.to) {
            //handle first fieldset
            service.FirstFieldSet.subscribe((fieldSet) => {
              console.log(`wizard-dynamic-step:  ${WizardDynamicStepComponent.instanceCount} : retrieved first set of fields ...`)
            })
          }
          else {
            //handle subsequent fieldsets
            service.NextFieldSet.subscribe((fieldSet) => {
              console.log(`wizard-dynamic-step:  ${WizardDynamicStepComponent.instanceCount} : retrieved next set of fields ...`)
            })
          }
        }
      }
      catch(err)
      {
          console.error(err.message);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnChanges.`)

    if (changes["wizard"].currentValue !== changes["wizard"].previousValue) {
      console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : wizard changed : updating wizard and configuring to observe wizard transitions `);
      (changes["wizard"].currentValue as IWizard).transitions.subscribe(this.getWizardTransitionHandler(this._fieldSetService));
    }

  }

  ngOnInit() {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnInit.`)

  }
  ngOnDestroy() {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnDestroy.`)
  }



}
