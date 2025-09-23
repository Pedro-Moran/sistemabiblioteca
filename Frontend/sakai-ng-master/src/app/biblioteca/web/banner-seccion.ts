import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'banner-seccion',
    imports: [ButtonModule, RippleModule],
    template: `
        <div
    class="relative flex flex-col items-center justify-center min-h-[400px] w-full px-6 lg:px-20 text-center"
    style="background: url('https://www.comunidadbaratz.com/wp-content/uploads/2021/11/Las-Bibliotecas-Publicas-del-Estado-son-centros-de-especial-importancia-para-el-desarrollo-cultural-del-pais.jpg') no-repeat center center; background-size: cover;"
>
    <!-- Capa oscura -->
    <div class="absolute inset-0 bg-[var(--overlay)] opacity-60"></div>

    <!-- Contenido -->
    <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl md:text-6xl font-bold text-[var(--text-contrast)] leading-tight">
        {{ titulo }}
        </h1>

        <!-- Caja de búsqueda con botón incluido -->

    </div>
</div>

    `
})
export class BannerSeccion {
    @Input() titulo: string = 'Título por defecto';
}
