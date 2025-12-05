import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl = `${environment.url_backend}/photos`;

  constructor(private http: HttpClient) { }

  list(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  view(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  create(photo: Photo): Observable<Photo> {
    return this.http.post<Photo>(this.apiUrl, photo);
  }

  update(photo: Photo): Observable<Photo> {
    return this.http.put<Photo>(`${this.apiUrl}/${photo.id}`, photo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Método especial para subir archivos
  upload(file: File, issueId: number, caption?: string): Observable<Photo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('issue_id', issueId.toString());
    if (caption) {
      formData.append('caption', caption);
    }
    return this.http.post<Photo>(`${this.apiUrl}/upload`, formData);
  }

  // Obtener URL de imagen
 getImageUrl(filename: string): string {
  if (!filename) return '';

  // Tomar solo el nombre del archivo
  const cleanName = filename.replace(/.*[\\/]/, '').replace(/\\/g, '/');

  return `${environment.url_backend}/uploads/${cleanName}`;
}



}
