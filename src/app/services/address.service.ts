import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = `${environment.url_backend}/addresses`;

  constructor(private http: HttpClient) { }

  list(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/${id}`);
  }

  create(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  update(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${address.id}`, address);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

