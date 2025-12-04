import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/models/driver.model';
import { DriverService } from 'src/app/services/driver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number;
  driver: Driver;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  statuses = [
    { value: 'available', label: 'Disponible' },
    { value: 'on_shift', label: 'En turno' },
    { value: 'unavailable', label: 'No disponible' }
  ];

  constructor(
    private driverService: DriverService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.driver = {} as Driver;
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
      this.driver.id = this.activatedRoute.snapshot.params.id;
      this.getDriver(this.driver.id);
    }
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      license_number: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      status: ['available', [Validators.required]]
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getDriver(id: number): void {
    this.driverService.view(id).subscribe({
      next: (data) => {
        this.driver = data;
        this.theFormGroup.patchValue({
          name: this.driver.name,
          license_number: this.driver.license_number,
          phone: this.driver.phone,
          email: this.driver.email,
          status: this.driver.status
        });
      },
      error: (err) => {
        console.error('Error al cargar conductor:', err);
      }
    });
  }

  back(): void {
    this.router.navigate(['/drivers/list']);
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const driverData: Driver = this.theFormGroup.value;
    this.driverService.create(driverData).subscribe({
      next: () => {
        Swal.fire('Creado', 'El conductor ha sido creado exitosamente.', 'success');
        this.router.navigate(['/drivers/list']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        Swal.fire('Error', 'No se pudo crear el conductor.', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const driverData: Driver = {
      ...this.theFormGroup.value,
      id: this.driver.id
    };

    this.driverService.update(driverData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El conductor ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/drivers/list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar el conductor.', 'error');
      }
    });
  }
}