import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { GeneratorsPageComponent } from './pages/generators/generators.page';

const routes: Routes = [
  {
    path: '',
    component: GeneratorsPageComponent,
  },
];

@NgModule({
  declarations: [GeneratorsPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class GeneratorsModule {}
