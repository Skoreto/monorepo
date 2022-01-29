import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './core/components/app/app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [],
  imports: [CoreModule, BrowserModule, RouterModule.forRoot(routes, {})],
  providers: [],
})
export class AppModule {}
