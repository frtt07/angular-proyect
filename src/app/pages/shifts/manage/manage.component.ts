import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shift } from 'src/app/models/shift.model';
import { ShiftService } from 'src/app/services/shift.service';
import { DriverService } from 'src/app/services/driver.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { Driver } from 'src/app/models/driver.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  shift: Shift;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  drivers: Driver[] = [];
  motorcycles: Motorcycle[] = [];
  statuses = [
    { value: 'active', label: 'Activo' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor(
    private shiftService: ShiftService,
    private driverService: DriverService,
    private motorcycleService: MotorcycleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.shift = {} as Shift;
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadDrivers();
    this.loadMotorcycles();
    
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.shift.id = this.activatedRoute.snapshot.params.id;
      this.getShift(this.shift.id);
    }
  }

  loadDrivers(): void {
    this.driverService.list().subscribe(data => this.drivers = data);
  }

  loadMotorcycles(): void {
    this.motorcycleService.list().subscribe(data => this.motorcycles = data);
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      driver_id: ['', [Validators.required]],
      motorcycle_id: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: [''],
      status: ['active', [Validators.required]]
    });
  }

  get fg() { return this.theFormGroup.controls; }

  getShift(id: number): void {
    this.shiftService.view(id).subscribe({
      next: (data) => {
        this.shift = data;
        this.theFormGroup.patchValue({
          driver_id: this.shift.driver_id,
          motorcycle_id: this.shift.motorcycle_id,
          start_time: this.shift.start_time?.substring(0, 16),
          end_time: this.shift.end_time?.substring(0, 16),
          status: this.shift.status
        });
      }
    });
  }

  back(): void { this.router.navigate(['/shifts/list']); }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    this.shiftService.create(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Creado', 'El turno ha sido creado.', 'success');
        this.router.navigate(['/shifts/list']);
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
    const shiftData = { ...this.theFormGroup.value, id: this.shift.id };
    this.shiftService.update(shiftData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El turno ha sido actualizado.', 'success');
        this.router.navigate(['/shifts/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
    });
  }
}