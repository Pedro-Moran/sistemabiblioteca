import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PortalService, NosotrosDTO } from '../../services/portal.service';
import { BucketService } from '../../services/bucket.service';

@Component({
    selector: 'app-nosotros',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardModule, DividerModule, InputTextModule, InputTextarea, ButtonModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmdialog></p-confirmdialog>
        <div class="grid">
            <div class="col-12">
                <div class="card flex flex-col gap-4 w-full">
                    <h5>Nosotros</h5>
                    <form [formGroup]="form" (ngSubmit)="guardar()" class="grid grid-cols-12 gap-4">
                        <div class="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3">
                            <label for="eyebrow">Subtitulo</label>
                            <input id="eyebrow" pInputText formControlName="eyebrow" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3">
                            <label for="title">Título</label>
                            <input id="title" pInputText formControlName="title" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3">
                            <label for="imagen">Imagen (PNG, máx 8MB)</label>
                            <input id="imagen" type="file" accept="image/png" (change)="onFileSelected($event)" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-12">
                            <label for="body">Texto</label>
                            <textarea id="body" pInputTextarea rows="6" formControlName="body" maxlength="500"></textarea>
                        </div>
                        <div class="col-span-12 flex justify-end">
                            <button pButton type="submit" label="Guardar" icon="pi pi-check" [disabled]="form.invalid"></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class Nosotros implements OnInit {
    form!: FormGroup;
    datos!: NosotrosDTO;
    archivo?: File;

    constructor(
        private fb: FormBuilder,
        private portal: PortalService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private bucket: BucketService
    ) {}

    ngOnInit() {
        // 1) Armamos el form
        this.form = this.fb.group({
            eyebrow: ['', Validators.required],
            title: ['', Validators.required],
            body: ['', [Validators.required, Validators.maxLength(500)]]
        });

        // 2) Cargamos los datos existentes
        this.portal.getNosotros().subscribe((dto) => {
            this.datos = dto;
            this.form.patchValue({
                eyebrow: dto.eyebrow,
                title: dto.title,
                body: dto.body
            });
        });
    }

    onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        if (file.type !== 'image/png') {
            this.messageService.add({ severity: 'warn', detail: 'Solo se permite imagen PNG' });
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            this.messageService.add({ severity: 'warn', detail: 'La imagen excede 8MB' });
            return;
        }
        this.archivo = file;
    }

    guardar() {
        if (this.form.invalid) return;

        this.confirmationService.confirm({
            message: '¿Desea guardar los cambios?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                const updated: NosotrosDTO = {
                    ...this.datos,
                    eyebrow: this.form.value.eyebrow,
                    title: this.form.value.title,
                    body: this.form.value.body
                };

                const save = () =>
                    this.portal.saveNosotros(updated).subscribe({
                        next: () => this.messageService.add({ severity: 'success', detail: '¡Guardado!' }),
                        error: () => this.messageService.add({ severity: 'error', detail: 'Error al guardar' })
                    });

                if (this.archivo) {
                    this.bucket.upload(this.archivo, 'nosotros', 1).subscribe({
                        next: (url) => {
                            updated.imageUrl = url;
                            save();
                        },
                        error: () =>
                            this.messageService.add({
                                severity: 'error',
                                detail: 'Error al subir imagen'
                            })
                    });
                } else {
                    save();
                }
            }
        });
    }
}
