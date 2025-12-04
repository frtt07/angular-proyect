import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1: view, 2: create, 3: update
  product: Product;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.product = {} as Product;
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
      this.product.id = this.activatedRoute.snapshot.params.id;
      this.getProduct(this.product.id);
    }
  }

  configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['']
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getProduct(id: number): void {
    this.productService.view(id).subscribe({
      next: (data) => {
        this.product = data;
        this.theFormGroup.patchValue({
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          category: this.product.category
        });
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
      }
    });
  }

  back(): void {
    this.router.navigate(['/products/list']);
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const productData: Product = this.theFormGroup.value;
    this.productService.create(productData).subscribe({
      next: () => {
        Swal.fire('Creado', 'El producto ha sido creado exitosamente.', 'success');
        this.router.navigate(['/products/list']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        Swal.fire('Error', 'No se pudo crear el producto.', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos.', 'error');
      return;
    }

    const productData: Product = {
      ...this.theFormGroup.value,
      id: this.product.id
    };

    this.productService.update(productData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El producto ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/products/list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
      }
    });
  }
}