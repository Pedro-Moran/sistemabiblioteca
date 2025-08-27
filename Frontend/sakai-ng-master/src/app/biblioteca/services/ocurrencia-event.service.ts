import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OcurrenciaEventService {
  /** Evento que emite el ID del equipo cuya ocurrencia fue autorizada */
  ocurrenciaAutorizada = new EventEmitter<number>();

  private storageKey = 'equiposConOcurrencia';
  /** Identificador de equipo a resaltar al abrir el módulo de ocurrencias */
  private highlightId: number | null = null;

  /** Lista de IDs almacenada en localStorage */
  private get pendientes(): number[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private set pendientes(ids: number[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  addEquipo(id: number): void {
    const ids = this.pendientes;
    if (!ids.includes(id)) {
      ids.push(id);
      this.pendientes = ids;
    }
  }

  removeEquipo(id: number): void {
    this.pendientes = this.pendientes.filter(e => e !== id);
  }

  tieneOcurrencia(id: number): boolean {
    return this.pendientes.includes(id);
  }

  notifyAutorizada(id: number): void {
    this.removeEquipo(id);
    this.ocurrenciaAutorizada.emit(id);
  }

  /** Establece el ID del equipo cuya ocurrencia debe resaltarse al navegar */
  setDestino(id: number): void {
    this.highlightId = id;
  }

  /** Devuelve y limpia el ID a resaltar */
  consumeDestino(): number | null {
    const id = this.highlightId;
    this.highlightId = null;
    return id;
  }
}
