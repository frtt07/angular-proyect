import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number;
  motorcycle: Motorcycle;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  statuses = [
    { value: 'available', label: 'Disponible' },
    { value: 'in_use', label: 'En uso' },
    { value: 'maintenance', label: 'Mantenimiento' }
  ];

  constructor(
    private motorcycleService: MotorcycleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.motorcycle = {} as Motorcycle;
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
      this.motorcycle.id = this.activatedRoute.snapshot.params.id;
      this.getMotorcycle(this.motorcycle.id);
    }
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      license_plate: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1990), Validators.max(2030)]],
      status: ['available', [Validators.required]]
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getMotorcycle(id: number): void {
    this.motorcycleService.view(id).subscribe({
      next: (data) => {
        this.motorcycle = data;
        this.theFormGroup.patchValue({
          license_plate: this.motorcycle.license_plate,
          brand: this.motorcycle.brand,
          year: this.motorcycle.year,
          status: this.motorcycle.status
        });
      },
      error: (err) => {
        console.error('Error al cargar moto:', err);
      }
    });
  }

  back(): void {
    this.router.navigate(['/motorcycles/list']);
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const motorcycleData: Motorcycle = this.theFormGroup.value;
    this.motorcycleService.create(motorcycleData).subscribe({
      next: () => {
        Swal.fire('Creado', 'La moto ha sido creada exitosamente.', 'success');
        this.router.navigate(['/motorcycles/list']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        Swal.fire('Error', 'No se pudo crear la moto.', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const motorcycleData: Motorcycle = {
      ...this.theFormGroup.value,
      id: this.motorcycle.id
    };

    this.motorcycleService.update(motorcycleData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La moto ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/motorcycles/list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar la moto.', 'error');
      }
    });
  }
}