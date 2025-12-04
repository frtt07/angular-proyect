import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/models/photo.model';
import { PhotoService } from 'src/app/services/photo.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/models/issue.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  photo: Photo;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  issues: Issue[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private photoService: PhotoService,
    private issueService: IssueService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.photo = {} as Photo;
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadIssues();
    
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.photo.id = this.activatedRoute.snapshot.params.id;
      this.getPhoto(this.photo.id);
    }
  }

  loadIssues(): void {
    this.issueService.list().subscribe(data => this.issues = data);
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      issue_id: ['', [Validators.required]],
      caption: [''],
      taken_at: ['']
    });
  }

  get fg() { return this.theFormGroup.controls; }

  getPhoto(id: number): void {
    this.photoService.view(id).subscribe({
      next: (data) => {
        this.photo = data;
        this.theFormGroup.patchValue({
          issue_id: this.photo.issue_id,
          caption: this.photo.caption,
          taken_at: this.photo.taken_at?.substring(0, 16)
        });
        if (this.photo.image_url) {
          this.previewUrl = this.photoService.getImageUrl(this.photo.image_url);
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  back(): void { this.router.navigate(['/photos/list']); }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid || !this.selectedFile) {
      Swal.fire('Error', 'Complete los campos requeridos y seleccione una imagen.', 'error');
      return;
    }
    
    const issueId = this.theFormGroup.get('issue_id')?.value;
    const caption = this.theFormGroup.get('caption')?.value || '';
    
    this.photoService.upload(this.selectedFile, issueId, caption).subscribe({
      next: () => {
        Swal.fire('Creado', 'La foto ha sido subida.', 'success');
        this.router.navigate(['/photos/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo subir la foto.', 'error')
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos.', 'error');
      return;
    }
    
    const photoData: Photo = {
      ...this.theFormGroup.value,
      id: this.photo.id,
      image_url: this.photo.image_url
    };
    
    this.photoService.update(photoData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La foto ha sido actualizada.', 'success');
        this.router.navigate(['/photos/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
    });
  }
}