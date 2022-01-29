import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AppComponent } from './components/app/app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

const components = [AppComponent, SidebarComponent];

@NgModule({
  declarations: [...components],
  imports: [SharedModule],
  exports: [RouterModule],
  providers: [],
})
export class CoreModule {}
