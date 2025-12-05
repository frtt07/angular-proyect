import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.list().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error:', err)
    });
  }

  openMap(): void {
    this.router.navigate(['/orders/map']);
  }

  create(): void { this.router.navigate(['/orders/create']); }
  view(id: number): void { this.router.navigate(['/orders/view', id]); }
  update(id: number): void { this.router.navigate(['/orders/update', id]); }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El pedido ha sido eliminado.', 'success');
            this.loadOrders();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'in_progress': return 'badge-info';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En progreso';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }
}