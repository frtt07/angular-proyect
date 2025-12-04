import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  issue: Issue;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  motorcycles: Motorcycle[] = [];
  
  issueTypes = [
    { value: 'accident', label: 'Accidente' },
    { value: 'breakdown', label: 'Avería' },
    { value: 'maintenance', label: 'Mantenimiento' }
  ];
  
  statuses = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'resolved', label: 'Resuelto' }
  ];

  constructor(
    private issueService: IssueService,
    private motorcycleService: MotorcycleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.issue = {} as Issue;
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadMotorcycles();
    
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.issue.id = this.activatedRoute.snapshot.params.id;
      this.getIssue(this.issue.id);
    }
  }

  loadMotorcycles(): void {
    this.motorcycleService.list().subscribe(data => this.motorcycles = data);
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      motorcycle_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      issue_type: ['breakdown', [Validators.required]],
      date_reported: ['', [Validators.required]],
      status: ['open', [Validators.required]]
    });
  }

  get fg() { return this.theFormGroup.controls; }

  getIssue(id: number): void {
    this.issueService.view(id).subscribe({
      next: (data) => {
        this.issue = data;
        this.theFormGroup.patchValue({
          motorcycle_id: this.issue.motorcycle_id,
          description: this.issue.description,
          issue_type: this.issue.issue_type,
          date_reported: this.issue.date_reported?.substring(0, 16),
          status: this.issue.status
        });
      }
    });
  }

  back(): void { this.router.navigate(['/issues/list']); }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    this.issueService.create(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Creado', 'La incidencia ha sido creada.', 'success');
        this.router.navigate(['/issues/list']);
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
    const issueData = { ...this.theFormGroup.value, id: this.issue.id };
    this.issueService.update(issueData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La incidencia ha sido actualizada.', 'success');
        this.router.navigate(['/issues/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
    });
  }
}