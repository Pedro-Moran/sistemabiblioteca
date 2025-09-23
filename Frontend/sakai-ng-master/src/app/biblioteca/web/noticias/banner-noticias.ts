import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'banner-noticias',
    imports: [ButtonModule, RippleModule],
    template: `
        <div
    class="relative flex flex-col items-center justify-center min-h-[300px] w-full px-6 lg:px-20 text-center"
    style="background: url('https://www.comunidadbaratz.com/wp-content/uploads/2021/11/Las-Bibliotecas-Publicas-del-Estado-son-centros-de-especial-importancia-para-el-desarrollo-cultural-del-pais.jpg') no-repeat center center; background-size: cover;"
>
    <!-- Capa oscura -->
    <div class="absolute inset-0 bg-black opacity-60"></div>

    <!-- Contenido -->
    <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight">
            BLOG DE NOTICIAS
        </h1>
    </div>
</div>

    `
})
export class BannerNoticias {}
