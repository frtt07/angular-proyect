import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';


import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User
  constructor(private securityService: SecurityService,
              private router:Router) {
    this.user = { email: "", password: "" }
  }
  login() {
    console.log("componente "+JSON.stringify(this.user))
    this.securityService.login(this.user).subscribe({
      next: (data) => {
        console.log("data "+JSON.stringify(data))
        this.securityService.saveSession(data)
        this.router.navigate(["dashboard"])
      },
      error: (error) => {
        console.error("error "+JSON.stringify(error))
        Swal.fire("Autenticación Inválida", "Usuario o contraseña inválido", "error")
      }
    })
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

}
