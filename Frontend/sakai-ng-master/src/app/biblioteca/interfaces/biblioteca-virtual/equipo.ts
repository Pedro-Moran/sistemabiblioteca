import { Estado } from "./estado";
import { Sede } from "./sede";

export class Equipo {
    id?: number;
    idEquipo?: number;
    estado?:Estado | null;
    nombreEquipo?: string;
    numeroEquipo?: string;
    ip?:string;
    equipoDiscapacidad?:boolean;
    sede?:string;
    activo?:boolean;
    sedeD?: Sede;
    cantidad?: number;
    horaInicio?: string;
    horaFin?: string;
    maxHoras?: string;
    tieneOcurrencia?: boolean;
    /** Indica si debe resaltarse el registro temporalmente */
    highlight?: boolean;
    constructor(init?: Partial<Equipo>) {
        this.id = 0;
        this.estado=null;
        this.nombreEquipo='';
        this.numeroEquipo='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
