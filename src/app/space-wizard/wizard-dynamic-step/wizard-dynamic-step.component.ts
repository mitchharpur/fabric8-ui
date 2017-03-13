import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IWizardStep, IWizard } from '../domain/wizard';
import { Wizard } from '../domain/wizard-implementation';


@Component({
  host: {
    'class': 'wizard-step'
  },
  selector: 'wizard-dynamic-step',
  templateUrl: './wizard-dynamic-step.component.html',
  styleUrls: ['./wizard-dynamic-step.component.scss'],
  providers: []

})
export class WizardDynamicStepComponent implements OnInit ,OnDestroy {

  static instanceCount: number = 0;

  @Input() wizard: IWizard;

  constructor() {
    WizardDynamicStepComponent.instanceCount++;
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : creating instance`);
  }

  ngOnInit() {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnInit`)
  }
  ngOnDestroy() {
    console.log(`wizard-dynamic-step: ${WizardDynamicStepComponent.instanceCount} : ngOnDestroy`)
  }



}
