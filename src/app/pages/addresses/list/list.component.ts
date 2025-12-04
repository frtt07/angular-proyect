import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  addresses: Address[] = [];

  constructor(private addressService: AddressService, private router: Router) { }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressService.list().subscribe({
      next: (data) => this.addresses = data,
      error: (err) => console.error('Error:', err)
    });
  }

  create(): void { this.router.navigate(['/addresses/create']); }
  view(id: number): void { this.router.navigate(['/addresses/view', id]); }
  update(id: number): void { this.router.navigate(['/addresses/update', id]); }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar esta dirección?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'La dirección ha sido eliminada.', 'success');
            this.loadAddresses();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }
}