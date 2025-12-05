import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MenuService } from 'src/app/services/menu.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { AddressService } from 'src/app/services/address.service';
import { Customer } from 'src/app/models/customer.model';
import { Menu } from 'src/app/models/menu.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { Address } from 'src/app/models/address.model';
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
  addresses: Address[] = [];
  
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
    private addressService: AddressService,
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
    this.loadAddresses();
    
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

  loadAddresses(): void {
    this.addressService.list().subscribe(data => {
      this.addresses = data;
    });
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      menu_id: ['', [Validators.required]],
      address_id: ['', [Validators.required]], // CAMPO NUEVO Y REQUERIDO
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
        
        // Si el backend devuelve address como objeto, extraemos su ID
        let addressId = '';
        if (this.order.address && this.order.address.id) {
          addressId = this.order.address.id.toString();
        }
        
        this.theFormGroup.patchValue({
          customer_id: this.order.customer_id,
          menu_id: this.order.menu_id,
          address_id: addressId,
          motorcycle_id: this.order.motorcycle_id || '',
          quantity: this.order.quantity,
          total_price: this.order.total_price,
          status: this.order.status
        });
      }
    });
  }

  back(): void { 
    this.router.navigate(['/orders/list']); 
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos, incluyendo la dirección de entrega.', 'error');
      return;
    }
    
    const orderData = this.theFormGroup.value;
    
    this.orderService.create(orderData).subscribe({
      next: () => {
        Swal.fire('Creado', 'El pedido ha sido creado con su dirección de entrega.', 'success');
        this.router.navigate(['/orders/list']);
      },
      error: (err) => {
        console.error('Error al crear pedido:', err);
        Swal.fire('Error', 'No se pudo crear el pedido.', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos, incluyendo la dirección de entrega.', 'error');
      return;
    }
    
    const orderData = { ...this.theFormGroup.value, id: this.order.id };
    
    this.orderService.update(orderData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El pedido ha sido actualizado.', 'success');
        this.router.navigate(['/orders/list']);
      },
      error: (err) => {
        console.error('Error al actualizar pedido:', err);
        Swal.fire('Error', 'No se pudo actualizar el pedido.', 'error');
      }
    });
  }

  // Método auxiliar para obtener texto completo de dirección
  getAddressFullText(address: Address): string {
    let text = `${address.street}, ${address.city}, ${address.state} - ${address.postal_code}`;
    if (address.additional_info) {
      text += ` (${address.additional_info})`;
    }
    return text;
  }
}