import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceWizardComponent } from './space-wizard.component';
import { WizardDynamicStepComponent } from './wizard-dynamic-step/wizard-dynamic-step.component';

@NgModule({
  imports: [CommonModule, FormsModule ],
  declarations: [SpaceWizardComponent,WizardDynamicStepComponent],
  exports: [SpaceWizardComponent]
})
export class SpaceWizardModule {

}
