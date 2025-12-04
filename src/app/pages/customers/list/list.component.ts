import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.list().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/customers/create']);
  }

  view(id: number): void {
    this.router.navigate(['/customers/view', id]);
  }

  update(id: number): void {
    this.router.navigate(['/customers/update', id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
            this.loadCustomers();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
          }
        });
      }
    });
  }
}