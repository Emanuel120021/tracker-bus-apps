// login.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ROLES } from 'src/app/enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('🔧 API URL:', this.apiUrl); // Debug
  }

  login(email: string, password: string) {
    const body = {
      email: email,
      password: password,
      userType: ROLES.DRIVER,
    };

    return this.http.post(`${this.apiUrl}/users/login`, body);
  }
}
