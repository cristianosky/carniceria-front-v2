import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ServiceLoginService } from '../services/login/service-login.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatGridListModule, MatCardModule, 
    MatFormField, MatInputModule, 
    MatButtonModule, MatProgressBarModule, 
    FormsModule, ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading: boolean = false;
  hide = true;
  mensajeError: string|null = null;
  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private _serviceLogin: ServiceLoginService)  {
    this.formLogin = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  get usuario() {
    return this.formLogin.get('usuario');
  }

  get contrasena() {
    return this.formLogin.get('contrasena');
  }

  login() {
    if (this.formLogin.valid) {
      this.isLoading = true;
      this._serviceLogin.login(this.formLogin.value).subscribe((response: any) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.usuario));
        this.isLoading = false;
        window.location.href = '/dashboard';
      }, (error) => {
        console.error(error.error.error);
        this.mensajeError = error.error.error;
        this.isLoading = false;
      });
    }
  }

}
