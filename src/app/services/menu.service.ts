import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = `${environment.url_backend}/menus`;

  constructor(private http: HttpClient) { }

  list(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  view(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`);
  }

  create(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu);
  }

  update(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${menu.id}`, menu);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
