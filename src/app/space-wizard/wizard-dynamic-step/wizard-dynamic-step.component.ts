import { Component, OnInit, OnDestroy, Input ,Inject } from '@angular/core';
import { Router } from '@angular/router';

import { IWizardStep, IWizard } from '../domain/wizard';
import { Wizard } from '../domain/wizard-implementation';

import { IFieldSetService, IFieldSetServiceProvider} from '../services/fieldset.service'


@Component({
  host: {
    'class': 'wizard-step'
  },
  selector: 'wizard-dynamic-step',
  templateUrl: './wizard-dynamic-step.component.html',
  styleUrls: ['./wizard-dynamic-step.component.scss'],
  providers: [IFieldSetServiceProvider.FactoryProvider]

})
export class WizardDynamicStepComponent implements OnInit ,OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 0;

  @Input() wizard: IWizard;

  constructor(@Inject(IFieldSetServiceProvider.TypeToken) private _fieldSetService:IFieldSetService) {
    WizardDynamicStepComponent.instanceCount++;
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : creating instance`);
  }

  ngOnInit() {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnInit.`)

    this._fieldSetService.FirstFieldSet.subscribe((fieldSet)=>{
      console.log(`wizard-dynamic-step:  ${WizardDynamicStepComponent.instanceCount} : retrieved first set of fields ...`)
    })
  }
  ngOnDestroy() {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnDestroy.`)
  }



}
