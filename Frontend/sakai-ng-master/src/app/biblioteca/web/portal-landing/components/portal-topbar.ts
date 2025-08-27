import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'portal-topbar',
    standalone: true,
    imports: [RouterModule],
    template: `<header class="site-header full-bleed">
  <div class="nav-inner">
    <a class="brand" (click)="go('home')">
      <img class="brand-logo" src="assets/BOTON-LOGO.png" alt="UPSJB" />
    </a>

    <nav class="main-nav">
      <a (click)="go('home')">Inicio</a>
      <a (click)="go('portal-nosotros')">Nosotros</a>
      <a (click)="go('portal-ejemplares')">Recursos</a>
      <a (click)="go('portal-noticias')">Noticias</a>
      <a (click)="go('portal-contactanos')">Contáctanos</a>
      <a (click)="go('portal-horarios')">Horarios</a>
    </nav>

    <div class="actions">
      <a class="login" routerLink="/login">Iniciar sesión</a>
      <a class="btn-registrate" routerLink="/registrate">Regístrate</a>
    </div>
  </div>
</header>`
})
export class PortalTopbar {
    constructor(private router: Router) {}

    go(fragment: string) {
        this.router.navigate(['/'], { fragment });
    }
}
