import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { Account } from './models/account.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  host = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBigbrass() {
    return this.http.get(`account/bigbrass`).pipe(map((res) => res));
  }

  updateMyAccount(payload: Partial<Account>) {
    return this.http.put(`account/${payload.id}`, payload).pipe(map((res) => res));
  }

  getFurniture() {
    return this.http.get('furniture').pipe(map((res) => res));
  }

  getLevels() {
    let reqHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .get(`levels`, { headers: reqHeaders })
      .pipe(map((res) => res));
  }

  getSlots() {
    return this.http.get(`/slots`).pipe(map((res) => res));
  }
}
