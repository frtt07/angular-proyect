import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number;
  customer: Customer;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.customer = {} as Customer;
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
      this.customer.id = this.activatedRoute.snapshot.params.id;
      this.getCustomer(this.customer.id);
    }
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getCustomer(id: number): void {
    this.customerService.view(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.theFormGroup.patchValue({
          name: this.customer.name,
          email: this.customer.email,
          phone: this.customer.phone
        });
      },
      error: (err) => {
        console.error('Error al cargar cliente:', err);
      }
    });
  }

  back(): void {
    this.router.navigate(['/customers/list']);
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const customerData: Customer = this.theFormGroup.value;
    this.customerService.create(customerData).subscribe({
      next: () => {
        Swal.fire('Creado', 'El cliente ha sido creado exitosamente.', 'success');
        this.router.navigate(['/customers/list']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        Swal.fire('Error', 'No se pudo crear el cliente.', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const customerData: Customer = {
      ...this.theFormGroup.value,
      id: this.customer.id
    };

    this.customerService.update(customerData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El cliente ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/customers/list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error');
      }
    });
  }
}
