import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shift } from '../models/shift.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private apiUrl = `${environment.url_backend}/shifts`;

  constructor(private http: HttpClient) { }

  list(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl);
  }

  view(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.apiUrl}/${id}`);
  }

  create(shift: Shift): Observable<Shift> {
    return this.http.post<Shift>(this.apiUrl, shift);
  }

  update(shift: Shift): Observable<Shift> {
    return this.http.put<Shift>(`${this.apiUrl}/${shift.id}`, shift);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
