// login.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ROLES } from 'src/app/enums/roles.enum';
import { environment } from 'src/environments/environment';

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
      user_type: ROLES.STUDENT,
    };

    return this.http.post(`${this.apiUrl}/users/login`, body);
  }
}
