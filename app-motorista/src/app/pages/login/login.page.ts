// src/app/pages/login/login.page.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eye, lockClosed } from 'ionicons/icons';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [HttpClient],
})
export class LoginPage {
  isLoaded = false;
  email: string = '';
  senha: string = '';

  constructor(private loginService: LoginService, private routes: Router) {
    // 👇 REGISTRA OS ÍCONES que esta página vai usar
    addIcons({ eye, lockClosed });
  }

  ionViewWillEnter() {
    this.isLoaded = false;
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }

  login() {
    // Em login.page.ts
    this.loginService.login(this.email, this.senha).subscribe({
      next: (resposta) => {
        if (resposta) {
          this.routes.navigate(['/mapa-motorista']);
        }
      },
      error: (err) => {
        console.log('Erro!', err);
      },
    });
  }
}
