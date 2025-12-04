import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  menus: Menu[] = [];

  constructor(private menuService: MenuService, private router: Router) { }

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.list().subscribe({
      next: (data) => this.menus = data,
      error: (err) => console.error('Error:', err)
    });
  }

  create(): void { this.router.navigate(['/menus/create']); }
  view(id: number): void { this.router.navigate(['/menus/view', id]); }
  update(id: number): void { this.router.navigate(['/menus/update', id]); }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este menú?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El menú ha sido eliminado.', 'success');
            this.loadMenus();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }
}