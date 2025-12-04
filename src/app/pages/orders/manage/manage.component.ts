import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MenuService } from 'src/app/services/menu.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { Customer } from 'src/app/models/customer.model';
import { Menu } from 'src/app/models/menu.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  order: Order;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  customers: Customer[] = [];
  menus: Menu[] = [];
  motorcycles: Motorcycle[] = [];
  statuses = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private menuService: MenuService,
    private motorcycleService: MotorcycleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.order = {} as Order;
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadMenus();
    this.loadMotorcycles();
    
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.order.id = this.activatedRoute.snapshot.params.id;
      this.getOrder(this.order.id);
    }
  }

  loadCustomers(): void {
    this.customerService.list().subscribe(data => this.customers = data);
  }

  loadMenus(): void {
    this.menuService.list().subscribe(data => this.menus = data);
  }

  loadMotorcycles(): void {
    this.motorcycleService.list().subscribe(data => this.motorcycles = data);
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      menu_id: ['', [Validators.required]],
      motorcycle_id: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total_price: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', [Validators.required]]
    });
  }

  get fg() { return this.theFormGroup.controls; }

  getOrder(id: number): void {
    this.orderService.view(id).subscribe({
      next: (data) => {
        this.order = data;
        this.theFormGroup.patchValue({
          customer_id: this.order.customer_id,
          menu_id: this.order.menu_id,
          motorcycle_id: this.order.motorcycle_id || '',
          quantity: this.order.quantity,
          total_price: this.order.total_price,
          status: this.order.status
        });
      }
    });
  }

  back(): void { this.router.navigate(['/orders/list']); }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    this.orderService.create(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Creado', 'El pedido ha sido creado.', 'success');
        this.router.navigate(['/orders/list']);
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
    const orderData = { ...this.theFormGroup.value, id: this.order.id };
    this.orderService.update(orderData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El pedido ha sido actualizado.', 'success');
        this.router.navigate(['/orders/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
    });
  }
}