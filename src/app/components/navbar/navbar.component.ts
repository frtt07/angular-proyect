import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  
  // Usuario actual
  currentUser: User = new User();
  isLoggedIn: boolean = false;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    
    // Suscribirse a cambios del usuario
    this.securityService.getUser().subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = this.securityService.existSession();
    });
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for(var item = 0; item < this.listTitles.length; item++){
      if(this.listTitles[item].path === titlee){
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    await this.securityService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Ir a login
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Obtener iniciales del nombre para avatar por defecto
   */
  getInitials(): string {
    if (this.currentUser?.name) {
      const names = this.currentUser.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return this.currentUser.name.substring(0, 2).toUpperCase();
    }
    return 'US';
  }
}