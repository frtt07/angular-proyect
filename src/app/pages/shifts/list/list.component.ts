import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shift } from 'src/app/models/shift.model';
import { ShiftService } from 'src/app/services/shift.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  shifts: Shift[] = [];

  constructor(private shiftService: ShiftService, private router: Router) { }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftService.list().subscribe({
      next: (data) => this.shifts = data,
      error: (err) => console.error('Error:', err)
    });
  }

  create(): void { this.router.navigate(['/shifts/create']); }
  view(id: number): void { this.router.navigate(['/shifts/view', id]); }
  update(id: number): void { this.router.navigate(['/shifts/update', id]); }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.shiftService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El turno ha sido eliminado.', 'success');
            this.loadShifts();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'active': return 'badge-success';
      case 'completed': return 'badge-info';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }
}