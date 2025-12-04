import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  address: Address;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  orders: Order[] = [];

  constructor(
    private addressService: AddressService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.address = {} as Address;
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadOrders();
    
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.address.id = this.activatedRoute.snapshot.params.id;
      this.getAddress(this.address.id);
    }
  }

  loadOrders(): void {
    this.orderService.list().subscribe(data => this.orders = data);
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      order_id: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      additional_info: ['']
    });
  }

  get fg() { return this.theFormGroup.controls; }

  getAddress(id: number): void {
    this.addressService.view(id).subscribe({
      next: (data) => {
        this.address = data;
        this.theFormGroup.patchValue(this.address);
      }
    });
  }

  back(): void { this.router.navigate(['/addresses/list']); }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    this.addressService.create(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Creado', 'La dirección ha sido creada.', 'success');
        this.router.navigate(['/addresses/list']);
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
    const addressData = { ...this.theFormGroup.value, id: this.address.id };
    this.addressService.update(addressData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La dirección ha sido actualizada.', 'success');
        this.router.navigate(['/addresses/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
    });
  }
}