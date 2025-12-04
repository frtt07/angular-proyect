import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.list().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/products/create']);
  }

  view(id: number): void {
    this.router.navigate(['/products/view', id]);
  }

  update(id: number): void {
    this.router.navigate(['/products/update', id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
            this.loadProducts();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          }
        });
      }
    });
  }
}