import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// const components = [];

const modules = [CommonModule, RouterModule];

@NgModule({
  // declarations: [...components],
  imports: [...modules],
  // exports: [...modules, ...components],
  exports: [...modules],
  providers: [],
})
export class SharedModule {}
