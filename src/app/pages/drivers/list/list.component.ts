import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from 'src/app/models/driver.model';
import { DriverService } from 'src/app/services/driver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  drivers: Driver[] = [];

  constructor(
    private driverService: DriverService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.list().subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (err) => {
        console.error('Error al cargar conductores:', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/drivers/create']);
  }

  view(id: number): void {
    this.router.navigate(['/drivers/view', id]);
  }

  update(id: number): void {
    this.router.navigate(['/drivers/update', id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este conductor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.driverService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El conductor ha sido eliminado.', 'success');
            this.loadDrivers();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el conductor.', 'error');
          }
        });
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'available': return 'badge-success';
      case 'on_shift': return 'badge-warning';
      case 'unavailable': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'on_shift': return 'En turno';
      case 'unavailable': return 'No disponible';
      default: return status;
    }
  }
}