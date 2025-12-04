import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Motorcycle } from '../models/motorcycle.model';

@Injectable({
  providedIn: 'root'
})
export class MotorcycleService {

  private apiUrl = `${environment.url_backend}/motorcycles`;

  constructor(private http: HttpClient) { }

  list(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(this.apiUrl);
  }

  view(id: number): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${this.apiUrl}/${id}`);
  }

  create(motorcycle: Motorcycle): Observable<Motorcycle> {
    return this.http.post<Motorcycle>(this.apiUrl, motorcycle);
  }

  update(motorcycle: Motorcycle): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${this.apiUrl}/${motorcycle.id}`, motorcycle);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Métodos especiales para tracking GPS
  startTracking(plate: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/track/${plate}`, {});
  }

  stopTracking(plate: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stop/${plate}`, {});
  }
}
