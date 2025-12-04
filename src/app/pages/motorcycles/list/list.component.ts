import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  motorcycles: Motorcycle[] = [];

  constructor(
    private motorcycleService: MotorcycleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMotorcycles();
  }

  loadMotorcycles(): void {
    this.motorcycleService.list().subscribe({
      next: (data) => {
        this.motorcycles = data;
      },
      error: (err) => {
        console.error('Error al cargar motos:', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/motorcycles/create']);
  }

  view(id: number): void {
    this.router.navigate(['/motorcycles/view', id]);
  }

  update(id: number): void {
    this.router.navigate(['/motorcycles/update', id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar esta moto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.motorcycleService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'La moto ha sido eliminada.', 'success');
            this.loadMotorcycles();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la moto.', 'error');
          }
        });
      }
    });
  }

  startTracking(plate: string): void {
    this.motorcycleService.startTracking(plate).subscribe({
      next: (response) => {
        Swal.fire('Tracking iniciado', `Seguimiento de ${plate} activado`, 'success');
      },
      error: (err) => {
        console.error('Error al iniciar tracking:', err);
        Swal.fire('Error', 'No se pudo iniciar el tracking.', 'error');
      }
    });
  }

  stopTracking(plate: string): void {
    this.motorcycleService.stopTracking(plate).subscribe({
      next: (response) => {
        Swal.fire('Tracking detenido', `Seguimiento de ${plate} detenido`, 'info');
      },
      error: (err) => {
        console.error('Error al detener tracking:', err);
        Swal.fire('Error', 'No se pudo detener el tracking.', 'error');
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'available': return 'badge-success';
      case 'in_use': return 'badge-warning';
      case 'maintenance': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'in_use': return 'En uso';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  }
}