import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturarRoutingModule } from './facturar-routing.module';
import { FacturarComponent } from './facturar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';


@NgModule({
  declarations: [
    FacturarComponent
  ],
  imports: [
    CommonModule,
    FacturarRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule
  ]
})
export class FacturarModule { }
