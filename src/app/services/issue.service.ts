import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private apiUrl = `${environment.url_backend}/issues`;

  constructor(private http: HttpClient) { }

  list(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl);
  }

  view(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  create(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue);
  }

  update(issue: Issue): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/${issue.id}`, issue);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}