import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  restaurants: Restaurant[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.list().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (err) => {
        console.error('Error al cargar restaurantes:', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/restaurants/create']);
  }

  view(id: number): void {
    this.router.navigate(['/restaurants/view', id]);
  }

  update(id: number): void {
    this.router.navigate(['/restaurants/update', id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este restaurante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restaurantService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El restaurante ha sido eliminado.', 'success');
            this.loadRestaurants();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el restaurante.', 'error');
          }
        });
      }
    });
  }
}