import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from 'src/app/models/photo.model';
import { PhotoService } from 'src/app/services/photo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  photos: Photo[] = [];

  constructor(private photoService: PhotoService, private router: Router) { }

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.photoService.list().subscribe({
      next: (data) => this.photos = data,
      error: (err) => console.error('Error:', err)
    });
  }

  create(): void { this.router.navigate(['/photos/create']); }
  view(id: number): void { this.router.navigate(['/photos/view', id]); }
  update(id: number): void { this.router.navigate(['/photos/update', id]); }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar esta foto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.photoService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'La foto ha sido eliminada.', 'success');
            this.loadPhotos();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  getImageUrl(filename: string): string {
    return this.photoService.getImageUrl(filename);
  }
}