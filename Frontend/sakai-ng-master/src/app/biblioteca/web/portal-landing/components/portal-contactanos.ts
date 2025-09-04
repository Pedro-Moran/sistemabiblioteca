import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../../pages/service/product.service';
import { PhotoService } from '../../../../pages/service/photo.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
@Component({
    selector: 'portal-contactanos',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CarouselModule, ButtonModule,TagModule,InputTextModule,FormsModule,
        CardModule,ReactiveFormsModule,TextareaModule
    ],
    template: `<div id="portal-contactanos" class="py-10 px-6 lg:px-20 mt-8 mx-auto max-w-7xl">
    <div class="grid grid-cols-12 gap-6 items-center">
        <!-- Sección de la imagen -->
        <div class="col-span-12 md:col-span-6 flex justify-center">
            <img src="https://appever-shreethemes.vercel.app/static/media/contact.466b2adb7954df5ba5c003f47742e14d.svg"
                alt="Contacto" class="max-w-[80%] md:max-w-full h-auto">
        </div>

        <!-- Sección del formulario -->
        <div class="col-span-12 md:col-span-6 flex justify-center">
            <div class="w-full md:w-[35rem] p-6 bg-[var(--surface)] shadow-lg rounded-xl border border-[var(--border)]">
                <h2 class="text-3xl font-semibold text-center text-[var(--text)] mb-4">
                    CONTÁCTENOS
                </h2>
                <p class="text-center text-[var(--muted)] mb-6">
                    ¡Póngase en contacto con nosotros!
                </p>

                <div class="flex flex-col space-y-4">
                    <div>
                        <label for="nombre" class="block text-[var(--text)] font-medium mb-1">Nombre</label>
                        <input pInputText id="nombre" type="text" placeholder="Ingrese su nombre"
                            class="w-full p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>

                    <div>
                        <label for="email1" class="block text-[var(--text)] font-medium mb-1">Email</label>
                        <input pInputText id="email1" type="email" placeholder="Ingrese su correo"
                            class="w-full p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>

                    <div>
                        <label for="asunto" class="block text-[var(--text)] font-medium mb-1">Asunto</label>
                        <input pInputText id="asunto" type="text" placeholder="Ingrese el asunto"
                            class="w-full p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>

                    <div>
                        <label for="mensaje" class="block text-[var(--text)] font-medium mb-1">Mensaje</label>
                        <textarea id="mensaje" pTextarea rows="5" placeholder="Escriba su mensaje aquí..."
                            class="w-full p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
                    </div>

                    <p-button label="Enviar" styleClass="w-full p-3 text-lg bg-[var(--primary)] text-[var(--text-contrast)] rounded-md hover:opacity-90 transition"
                        routerLink="/main">
                    </p-button>
                </div>
            </div>
        </div>
    </div>
</div>


`,
                    providers: [MessageService, ConfirmationService,ProductService,PhotoService]
})
export class PortalContactanos implements OnInit{

    loginForm: FormGroup = new FormGroup({});
    constructor(private router: Router) { }


              ngOnInit() {
            }


    enviarMensaje() {
        this.router.navigate(['/']);
      }
}
