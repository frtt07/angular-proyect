import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ProductService } from 'src/app/services/product.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Product } from 'src/app/models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  menu: Menu;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  restaurants: Restaurant[] = [];
  products: Product[] = [];

  constructor(
    private menuService: MenuService,
    private restaurantService: RestaurantService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.menu = {} as Menu;
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadProducts();
    
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.menu.id = this.activatedRoute.snapshot.params.id;
      this.getMenu(this.menu.id);
    }
  }

  loadRestaurants(): void {
    this.restaurantService.list().subscribe(data => this.restaurants = data);
  }

  loadProducts(): void {
    this.productService.list().subscribe(data => this.products = data);
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      restaurant_id: ['', [Validators.required]],
      product_id: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      availability: [true]
    });
  }

  get fg() { return this.theFormGroup.controls; }

  getMenu(id: number): void {
    this.menuService.view(id).subscribe({
      next: (data) => {
        this.menu = data;
        this.theFormGroup.patchValue({
          restaurant_id: this.menu.restaurant_id,
          product_id: this.menu.product_id,
          price: this.menu.price,
          availability: this.menu.availability
        });
      }
    });
  }

  back(): void { this.router.navigate(['/menus/list']); }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    this.menuService.create(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Creado', 'El menú ha sido creado.', 'success');
        this.router.navigate(['/menus/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear.', 'error')
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    const menuData = { ...this.theFormGroup.value, id: this.menu.id };
    this.menuService.update(menuData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El menú ha sido actualizado.', 'success');
        this.router.navigate(['/menus/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
    });
  }
}
