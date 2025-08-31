import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'portal-footer',
    imports: [RouterModule],
    template: `<div class="bg-[var(--surface)] ">
        <div class="py-12 px-8 lg:px-20">
            <div class="grid grid-cols-12 gap-8">
                <!-- LOGO Y CONTACTO -->
                <div class="col-span-12 lg:col-span-4 text-start">
                    <div class="flex flex-col items-center lg:items-start gap-4">
                        <img src="assets/BOTON-LOGO.png" class="h-16" alt="Logo UPSJB" />

                        <div class="mt-4 space-y-2">
                            <p class="font-bold">CONTÁCTANOS</p>
                            <p>📧 Correo: biblioteca&#64;upsjb.edu.pe</p>
                            <p>📞 Central Institucional: (01) 6449131</p>
                            <p>🏛️ Mesa de partes virtual:<br/>mesadepartes&#64;upsjb.edu.pe</p>
                            <p>❓¿Tienes un reclamo?<br/>
                                <a href="https://libroreclamaciones.upsjb.edu.pe/#/formulario" class="underline text-pink-400">Ingresa aquí</a>
                            </p>
                            <a href="https://libroreclamaciones.upsjb.edu.pe/#/formulario">
                                <img src="assets/libroreclamaciones.png" class="h-12 mt-2" alt="Libro de Reclamaciones" />
                            </a>
                        </div>

                        <div class="flex gap-4 mt-4">
                            <i class="pi pi-facebook text-2xl hover:text-pink-400 cursor-pointer"></i>
                            <i class="pi pi-instagram text-2xl hover:text-pink-400 cursor-pointer"></i>
                            <i class="pi pi-tiktok text-2xl hover:text-pink-400 cursor-pointer"></i>
                            <i class="pi pi-linkedin text-2xl hover:text-pink-400 cursor-pointer"></i>
                        </div>
                    </div>
                </div>

                <!-- ENLACES DE INTERÉS -->
                <div class="col-span-12 lg:col-span-4 text-start">
                    <h4 class="text-lg font-bold mb-4">/ ENLACES DE INTERÉS</h4>
                    <ul class="list-disc list-inside space-y-2">
                        <li>Inicio</li>
                        <li>Sobre la UPSJB</li>
                        <li>Pregrado</li>
                        <li>Pre San Juan</li>
                        <li>Maestrías</li>
                        <li>Educación continua</li>
                        <li>Centros de Idiomas</li>
                        <li>Misión y Visión</li>
                    </ul>
                </div>

                <!-- FILIALES -->
                <div class="col-span-12 lg:col-span-4">
                    <h4 class="text-lg font-bold mb-4">/ LOCALES & FILIALES</h4>
                    <div class="space-y-4 text-sm">
                        <div class="flex gap-4">
                            <img src="assets/CHORRILLOS.jpeg" class="w-16 h-16 object-cover" alt="Chorrillos">
                            <div>
                                <p class="font-bold">Chorrillos</p>
                                <p>Av. José Antonio Lavalle N° 302 - 304 (Ex Hacienda Villa)</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <img src="assets/SAN-BORJA.jpeg" class="w-16 h-16 object-cover" alt="San Borja">
                            <div>
                                <p class="font-bold">San Borja</p>
                                <p>Av. San Luis N° 1923 - 1925 - 1931</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <img src="assets/ICA.jpeg" class="w-16 h-16 object-cover" alt="Ica">
                            <div>
                                <p class="font-bold">Ica</p>
                                <p>Carretera Panamericana Sur N° 103, 113 y 123 (Ex Km 300)</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <img src="assets/CHINCHA.jpeg" class="w-16 h-16 object-cover" alt="Chincha">
                            <div>
                                <p class="font-bold">Chincha</p>
                                <p>Calle Albilla N° 108 Urbanización Las Viñas (Ex Toche)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SUSCRÍBETE -->
        <div class="bg-neutral-900 py-8 px-6 lg:px-20 text-center">
            <h3 class="text-pink-500 text-2xl font-semibold">Suscríbete Con Nosotros!</h3>
            <p class="text-white mt-2">Te enviaremos las noticias más recientes.</p>
        </div>

        <!-- COPYRIGHT -->
        <div class="bg-neutral-800 text-center text-sm text-white py-4">
            2025 Todos los Derechos Reservados por © Universidad Privada San Juan Bautista
        </div>
    </div>
    `
})
export class PortalFooter {
    constructor(public router: Router) {}
}
