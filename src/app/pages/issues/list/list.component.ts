import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private issueService: IssueService, private router: Router) { }

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    this.issueService.list().subscribe({
      next: (data) => this.issues = data,
      error: (err) => console.error('Error:', err)
    });
  }

  create(): void { this.router.navigate(['/issues/create']); }
  view(id: number): void { this.router.navigate(['/issues/view', id]); }
  update(id: number): void { this.router.navigate(['/issues/update', id]); }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar esta incidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.issueService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'La incidencia ha sido eliminada.', 'success');
            this.loadIssues();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  getTypeBadge(type: string): string {
    switch (type) {
      case 'accident': return 'badge-danger';
      case 'breakdown': return 'badge-warning';
      case 'maintenance': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'accident': return 'Accidente';
      case 'breakdown': return 'Avería';
      case 'maintenance': return 'Mantenimiento';
      default: return type;
    }
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'open': return 'badge-danger';
      case 'in_progress': return 'badge-warning';
      case 'resolved': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En progreso';
      case 'resolved': return 'Resuelto';
      default: return status;
    }
  }
}