export interface Authentication {
    usuario:string;
    contrasena:string;
    displayName:string;
    givenName:string;
    surname:string;
    userPrincipalName:string;
    }
export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
}
