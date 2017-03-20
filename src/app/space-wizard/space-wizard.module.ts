import { NgModule, FactoryProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceWizardComponent } from './space-wizard.component';
import { WizardDynamicStepComponent } from './wizard-dynamic-step/wizard-dynamic-step.component';

// import { IFieldSetServiceProvider,FieldSetServiceProvider } from './services/field-set.service'
// import { ISpaceMagicServiceProvider,SpaceMagicServiceProvider } from './services/space-magic.service'

@NgModule({
  imports: [CommonModule, FormsModule ],
  declarations: [SpaceWizardComponent,WizardDynamicStepComponent],
  exports: [SpaceWizardComponent]//,
  //providers:[IFieldSetServiceProvider.MockFactoryProvider,ISpaceMagicServiceProvider.MockFactoryProvider]
})
export class SpaceWizardModule {

}
