import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number;
  restaurant: Restaurant;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  constructor(
    private restaurantService: RestaurantService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.restaurant = {} as Restaurant;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activatedRoute.snapshot.params.id) {
      this.restaurant.id = this.activatedRoute.snapshot.params.id;
      this.getRestaurant(this.restaurant.id);
    }
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]]
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getRestaurant(id: number): void {
    this.restaurantService.view(id).subscribe({
      next: (data) => {
        this.restaurant = data;
        this.theFormGroup.patchValue({
          name: this.restaurant.name,
          address: this.restaurant.address,
          phone: this.restaurant.phone,
          email: this.restaurant.email
        });
      },
      error: (err) => {
        console.error('Error al cargar restaurante:', err);
      }
    });
  }

  back(): void {
    this.router.navigate(['/restaurants/list']);
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const restaurantData: Restaurant = this.theFormGroup.value;
    this.restaurantService.create(restaurantData).subscribe({
      next: () => {
        Swal.fire('Creado', 'El restaurante ha sido creado exitosamente.', 'success');
        this.router.navigate(['/restaurants/list']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        Swal.fire('Error', 'No se pudo crear el restaurante.', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const restaurantData: Restaurant = {
      ...this.theFormGroup.value,
      id: this.restaurant.id
    };

    this.restaurantService.update(restaurantData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El restaurante ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/restaurants/list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar el restaurante.', 'error');
      }
    });
  }
}