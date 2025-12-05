import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

// Firebase 9+ (API Modular)
import { Auth, signInWithPopup, signOut, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  theUser = new BehaviorSubject<User>(new User);
  
  constructor(
    private http: HttpClient,
    private auth: Auth
  ) { 
    this.verifyActualSession();
  }

  // ==================== LOGIN TRADICIONAL ====================
  
  /**
   * Login con email y contraseña (backend propio)
   */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_backend}/login`, user);
  }

  // ==================== OAUTH PROVIDERS ====================

  /**
   * Login con Google
   */
  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Login con Microsoft
   */
  loginWithMicrosoft(): Promise<UserCredential> {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('user.read');
    provider.addScope('openid');
    provider.addScope('profile');
    provider.addScope('email');
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Login con GitHub
   */
  loginWithGitHub(): Promise<UserCredential> {
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    return signInWithPopup(this.auth, provider);
  }

  // ==================== PROCESAR RESPUESTA OAUTH ====================

  /**
   * Procesa la respuesta de Firebase OAuth y guarda la sesión
   */
  async processOAuthResponse(result: UserCredential): Promise<User> {
    const firebaseUser = result.user;
    
    if (!firebaseUser) {
      throw new Error('No se pudo obtener información del usuario');
    }

    // Obtener el token de acceso
    const accessToken = await firebaseUser.getIdToken();
    
    // Determinar el proveedor
    let provider = 'unknown';
    if (result.providerId === 'google.com' || firebaseUser.providerData[0]?.providerId === 'google.com') {
      provider = 'google';
    } else if (result.providerId === 'microsoft.com' || firebaseUser.providerData[0]?.providerId === 'microsoft.com') {
      provider = 'microsoft';
    } else if (result.providerId === 'github.com' || firebaseUser.providerData[0]?.providerId === 'github.com') {
      provider = 'github';
    }

    // Crear objeto de usuario
    const user: User = {
      id: 0,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
      email: firebaseUser.email || '',
      password: '',
      token: accessToken,
      photoURL: firebaseUser.photoURL || '',
      provider: provider,
      providerId: firebaseUser.uid
    };

    // Guardar sesión
    this.saveSession(user);
    
    return user;
  }

  // ==================== GESTIÓN DE SESIÓN ====================

  /**
   * Guardar sesión en localStorage
   */
  saveSession(dataSesion: any) {
    let data: User;
    
    // Si viene de OAuth (tiene photoURL y provider)
    if (dataSesion.provider) {
      data = {
        id: dataSesion.id || 0,
        name: dataSesion.name,
        email: dataSesion.email,
        password: '',
        token: dataSesion.token,
        photoURL: dataSesion.photoURL,
        provider: dataSesion.provider,
        providerId: dataSesion.providerId
      };
    } else {
      // Si viene del login tradicional (backend)
      data = {
        id: dataSesion["id"],
        name: dataSesion["name"],
        email: dataSesion["email"],
        password: "",
        token: dataSesion["token"],
        photoURL: '',
        provider: 'email',
        providerId: ''
      };
    }
    
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data);
  }

  /**
   * Actualiza el usuario en el BehaviorSubject
   */
  setUser(user: User) {
    this.theUser.next(user);
  }

  /**
   * Obtener usuario como Observable
   */
  getUser(): Observable<User> {
    return this.theUser.asObservable();
  }

  /**
   * Obtener usuario activo
   */
  public get activeUserSession(): User {
    return this.theUser.value;
  }

  /**
   * Cerrar sesión (incluye Firebase)
   */
  async logout(): Promise<void> {
    // Cerrar sesión en Firebase
    await signOut(this.auth);
    
    // Limpiar localStorage
    localStorage.removeItem('sesion');
    
    // Resetear usuario
    this.setUser(new User());
  }

  /**
   * Verificar sesión actual
   */
  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  /**
   * Verificar si existe sesión
   */
  existSession(): boolean {
    let sesionActual = this.getSessionData();
    return (sesionActual) ? true : false;
  }

  /**
   * Obtener datos de sesión del localStorage
   */
  getSessionData(): string | null {
    return localStorage.getItem('sesion');
  }
}