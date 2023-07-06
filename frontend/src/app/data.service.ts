import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  host = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAccount() {
    return this.http.get(`account/bigbrass`).pipe(map((res) => res));
  }

  getLevels() {
    let reqHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .get(`levels`, { headers: reqHeaders })
      .pipe(map((res) => res));
  }

  getShopExpansionSlots() {
    return this.http.get(`/slots/shopExpansions`).pipe(map((res) => res));
  }
}
