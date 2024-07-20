import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturarComponent } from './facturar.component';

const routes: Routes = [
  { path: '', component: FacturarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturarRoutingModule { }
