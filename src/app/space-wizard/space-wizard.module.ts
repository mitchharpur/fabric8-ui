import { NgModule, FactoryProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceWizardComponent } from './space-wizard.component';
import { WizardDynamicStepComponent } from './components/wizard-dynamic-step/wizard-dynamic-step.component';

import { IForgeServiceProvider } from './services/forge.service'
import { LoggerFactory } from './common/logger'
import { WorkflowFactory, IWorkflowProvider } from './models/workflow'

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SpaceWizardComponent, WizardDynamicStepComponent],
  exports: [SpaceWizardComponent],
  providers: [IForgeServiceProvider.FactoryProvider, LoggerFactory, WorkflowFactory]
})
export class SpaceWizardModule {

};
