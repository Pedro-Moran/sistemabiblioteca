import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TemplateModule } from '../../template.module';

@Component({
    selector: 'app-modal-vista-pdf',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '80vw'}" header="Vista previa" [modal]="true" [closable]="true">
        <ng-template pTemplate="content">
            <iframe *ngIf="pdfSrc" [src]="pdfSrc" style="width:100%;height:70vh" ></iframe>
        </ng-template>
    </p-dialog>`,
    imports: [TemplateModule]
})
export class ModalVistaPdf {
    display: boolean = false;
    pdfSrc: SafeResourceUrl | null = null;
    constructor(private sanitizer: DomSanitizer) {}

    openModal(blob: Blob) {
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.display = true;
    }

    close() {
        this.display = false;
        this.pdfSrc = null;
    }
}
