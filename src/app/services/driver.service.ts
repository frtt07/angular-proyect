import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private apiUrl = `${environment.url_backend}/drivers`;

  constructor(private http: HttpClient) { }

  list(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  view(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  create(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  update(driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${driver.id}`, driver);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
