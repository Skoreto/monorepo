import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestsOverviewPageComponent } from './pages/tests-overview/tests-overview.page';

const routes: Routes = [
  {
    path: '',
    component: TestsOverviewPageComponent,
  },
];

@NgModule({
  declarations: [TestsOverviewPageComponent],
  imports: [RouterModule.forChild(routes)],
  providers: [],
})
export class CoreModule {}
