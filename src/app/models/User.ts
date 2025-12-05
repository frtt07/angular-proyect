export class User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  token?: string;
  
  // Campos OAuth
  photoURL?: string;      // Foto de perfil del proveedor
  provider?: string;      // 'google' | 'microsoft' | 'github' | 'email'
  providerId?: string;    // UID del proveedor
  
  constructor() {
    this.id = 0;
    this.name = "";
    this.email = "";
    this.password = "";
    this.token = "";
    this.photoURL = "";
    this.provider = "";
    this.providerId = "";
  }
}
