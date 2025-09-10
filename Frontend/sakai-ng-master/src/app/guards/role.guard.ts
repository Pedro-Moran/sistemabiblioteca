import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../biblioteca/services/auth.service'; // Ajusta la ruta según tu estructura
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
        // 🚨 Verificar si el usuario está autenticado
        if (!this.authService.idAuthenticated()) {
          console.warn('Usuario no autenticado, redirigiendo al inicio');
          return this.router.createUrlTree(['/']);
        }
    const requiredRoles: string[] = route.data['roles'] || []; // Obtiene los roles permitidos de la ruta
    if (requiredRoles.length === 0) {
      return true;
    }
    const userRoles: string[] = this.authService.getRoles() || []; // Obtiene los roles del usuario
    // Imprime en consola los roles requeridos y los roles del usuario
        console.log('Roles requeridos:', requiredRoles);
        const userRole = localStorage.getItem('role');
        console.log('Rol del usuario:', userRole);
        console.log('Roles del usuario:', userRoles);
    const hasAccess = requiredRoles.some(role => userRoles.includes(role)); // Verifica si el usuario tiene el rol requerido

    return hasAccess ? true : this.router.createUrlTree(['/notfound']); // Si no tiene acceso, lo redirige a "notfound"
  }
}
