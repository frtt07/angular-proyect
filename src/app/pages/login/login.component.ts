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
  user: User;
  isLoading: boolean = false;

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {
    this.user = { email: "", password: "" };
  }

  ngOnInit() {
    // Si ya hay sesión, redirigir al dashboard
    if (this.securityService.existSession()) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnDestroy() {}

  // ==================== LOGIN TRADICIONAL ====================

  login() {
    if (!this.user.email || !this.user.password) {
      Swal.fire('Campos requeridos', 'Por favor ingresa email y contraseña', 'warning');
      return;
    }

    this.isLoading = true;
    
    this.securityService.login(this.user).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.securityService.saveSession(data);
        this.showWelcomeMessage(data.name || this.user.email);
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error login:', error);
        Swal.fire('Autenticación Inválida', 'Usuario o contraseña inválido', 'error');
      }
    });
  }

  // ==================== OAUTH LOGINS ====================

  /**
   * Login con Google
   */
  async loginWithGoogle() {
  this.isLoading = true;
  
  try {
    const result = await this.securityService.loginWithGoogle();
    
    // ===== DEBUG - Agrega estas líneas =====
    console.log('=== DEBUG GOOGLE ===');
    console.log('Result completo:', result);
    console.log('Firebase User:', result.user);
    console.log('PhotoURL de Firebase:', result.user?.photoURL);
    console.log('ProviderData:', result.user?.providerData);
    // ===== FIN DEBUG =====
    
    const user = await this.securityService.processOAuthResponse(result);
    
    // ===== DEBUG - También aquí =====
    console.log('Usuario procesado:', user);
    console.log('PhotoURL guardada:', user.photoURL);
    // ===== FIN DEBUG =====
    
    this.isLoading = false;
    this.showWelcomeMessage(user.name || 'Usuario', user.photoURL);
    this.router.navigate(['dashboard']);
    
  } catch (error: any) {
    this.isLoading = false;
    this.handleOAuthError(error, 'Google');
  }
}

  /**
   * Login con Microsoft
   */
  async loginWithMicrosoft() {
    this.isLoading = true;
    
    try {
      const result = await this.securityService.loginWithMicrosoft();
      const user = await this.securityService.processOAuthResponse(result);
      
      this.isLoading = false;
      this.showWelcomeMessage(user.name || 'Usuario', user.photoURL);
      this.router.navigate(['dashboard']);
      
    } catch (error: any) {
      this.isLoading = false;
      this.handleOAuthError(error, 'Microsoft');
    }
  }

  /**
   * Login con GitHub
   */
  async loginWithGitHub() {
    this.isLoading = true;
    
    try {
      const result = await this.securityService.loginWithGitHub();
      const user = await this.securityService.processOAuthResponse(result);
      
      this.isLoading = false;
      this.showWelcomeMessage(user.name || 'Usuario', user.photoURL);
      this.router.navigate(['dashboard']);
      
    } catch (error: any) {
      this.isLoading = false;
      this.handleOAuthError(error, 'GitHub');
    }
  }

  // ==================== HELPERS ====================

  /**
   * Muestra mensaje de bienvenida con foto de perfil
   */
  private showWelcomeMessage(name: string, photoURL?: string) {
    const imageHtml = photoURL 
      ? `<img src="${photoURL}" class="rounded-circle mb-3" style="width: 80px; height: 80px; object-fit: cover;">`
      : '';
    
    Swal.fire({
      title: `¡Bienvenido!`,
      html: `${imageHtml}<p class="mb-0">${name}</p>`,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  /**
   * Maneja errores de OAuth
   */
  private handleOAuthError(error: any, provider: string) {
    console.error(`Error ${provider}:`, error);
    
    let message = 'Ocurrió un error durante la autenticación';
    
    // Errores comunes de Firebase
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        message = 'Cancelaste el inicio de sesión';
        break;
      case 'auth/popup-blocked':
        message = 'El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes.';
        break;
      case 'auth/account-exists-with-different-credential':
        message = 'Ya existe una cuenta con este email usando otro método de inicio de sesión.';
        break;
      case 'auth/cancelled-popup-request':
        message = 'Se canceló la solicitud de autenticación';
        break;
      case 'auth/network-request-failed':
        message = 'Error de conexión. Verifica tu conexión a internet.';
        break;
      default:
        message = error.message || message;
    }
    
    Swal.fire(`Error con ${provider}`, message, 'error');
  }
}
