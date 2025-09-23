import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateModule } from '../../template.module';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { GenericoService } from '../../services/generico.service';
import { ReservasService } from '../../services/reservas.service';
import { FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';
import { PortalService } from '../../services/portal.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
    selector: 'calendar-reserva',
    template: `
    
        <div id="calendar-reserva" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
          

            
    <full-calendar [options]="calendarOptions"></full-calendar>
            

        </div>
        <p-dialog [(visible)]="displayModal" header="Reservar Evento" [modal]="true" [closable]="false">
  <div class="p-fluid">
    <label for="eventTitle">Título del evento:</label>
    <input id="eventTitle" type="text" pInputText [(ngModel)]="newEventTitle" />
  </div>

  <ng-template pTemplate="footer">
    <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text" (click)="displayModal = false"></button>
    <button pButton label="Guardar" icon="pi pi-check" class="p-button-primary" (click)="saveEvent()"></button>
  </ng-template>
</p-dialog>
    `,
    imports: [TemplateModule, TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class CalendarReserva implements OnInit {
    modulo: string = "reserva";
    user: any;
    displayModal: boolean = false; // Estado del modal
  newEventTitle: string = ''; // Título del nuevo evento
  selectedDate: string = ''; // Fecha seleccionada
  events: any[] = [
    { title: 'Reservado', start: '2025-03-04T10:00:00', end: '2025-03-04T11:00:00', reserved: true },
    { title: 'Reservado', start: '2025-03-06T14:00:00', end: '2025-03-06T15:00:00', reserved: true }
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    locale: esLocale,
    nowIndicator: true,
    firstDay: 1,
    events: this.events,
    select: this.onDateSelect.bind(this),
    eventOverlap: false, // No permite superposición de eventos
    eventClick: this.preventEventEdit.bind(this), // Evita edición manual
    eventStartEditable: false, // Evita arrastrar inicio del evento
    eventDurationEditable: false, // Evita cambiar la duración
    selectAllow: (selectInfo) => {
        const start = selectInfo.start;
        const end = selectInfo.end;
        const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convertir a horas
    
        return diffInHours >= 1 && diffInHours <= 2; // Mínimo 1 hora, máximo 2 horas
      },
   // selectAllow: this.isSelectable.bind(this), // Bloquear selección en horarios ocupados
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5], // Lunes a viernes
      startTime: '08:00',
      endTime: '18:00'
    },
    eventConstraint: {
      startTime: '08:00', // Horario permitido para reservas
      endTime: '18:00'
    }
  };



    constructor(private router: Router, private materialBibliograficoService: MaterialBibliograficoService, private portalService: PortalService, private reservasService: ReservasService, private genericoService: GenericoService,

        usuariooService: UsuarioService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            "idusuario": 0
        }
    }
    
  // Abrir modal cuando se selecciona una fecha
  onDateSelect(selectInfo: any) {
    this.selectedDate = selectInfo.startStr;
    this.displayModal = true;
  }

  // Validar si el rango seleccionado está disponible
  isSelectable(selectInfo: any) {
    for (let event of this.events) {
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      const selectStart = selectInfo.start.getTime();
      const selectEnd = selectInfo.end.getTime();
  
      if (selectStart < eventEnd && selectEnd > eventStart) {
        return false; // Bloquea la selección si hay cruce con un evento reservado
      }
    }
    return true; // Permite selección si no hay conflicto
  }
  // Guardar evento y bloquear la hora
  saveEvent() {
    if (this.newEventTitle.trim() === '') return;

    let newEvent = {
      title: this.newEventTitle,
      start: this.selectedDate,
      end: new Date(new Date(this.selectedDate).getTime() + 60 * 60 * 1000), // Añade 1 hora automáticamente
      reserved: true
    };
    console.log(this.selectedDate);
    console.log(new Date(new Date(this.selectedDate).getTime() + 60 * 60 * 1000));

    this.events.push(newEvent);
    this.calendarOptions.events = [...this.events];
    this.displayModal = false;
    this.newEventTitle = '';
  }
  preventEventEdit(eventClickInfo: any) {
    eventClickInfo.jsEvent.preventDefault(); // Bloquea interacción con el evento
  }
}
