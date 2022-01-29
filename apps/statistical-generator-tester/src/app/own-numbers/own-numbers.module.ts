import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { OwnNumbersPageComponent } from './pages/own-numbers/own-numbers.page';

const routes: Routes = [
  {
    path: '',
    component: OwnNumbersPageComponent,
  },
];

@NgModule({
  declarations: [OwnNumbersPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class OwnNumbersModule {}
