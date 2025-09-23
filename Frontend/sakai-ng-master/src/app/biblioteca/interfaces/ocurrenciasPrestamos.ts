import { ClaseGeneral } from "./clase-general";
import { Ejemplar } from "./detalle";
import { Prestamo } from "./prestamo";
import { Usuario } from "./usuario";

export class OcurrenciasPrestamos {
    id: number;
    fechaRegistro:Date;
    fechaOcurrencia:Date | null;
    codigoAlumno: string;
    nombreInvolucrado:string;
    codigoBibliografico: string;
    numeroIngreso: string;
    ejemplar:Ejemplar | null;
    detalle: string;
    prestamo:Prestamo | null;
    usuarioRegistro:Usuario | null;
    costo:number;
    usuarioCosto:Usuario | null;
    mailEnviado:boolean
    fechaEnvio:Date | null;
    situacionOcurrencia:ClaseGeneral | null;
    constructor(init?: Partial<OcurrenciasPrestamos>) {
        this.id = 0;
        this.fechaRegistro=new Date();
        this.fechaOcurrencia=null;
        this.codigoAlumno='';
        this.nombreInvolucrado='';
        this.codigoBibliografico='';
        this.numeroIngreso='';
        this.ejemplar=null;
        this.detalle='';
        this.prestamo=null;
        this.usuarioRegistro=null;
        this.costo=0;
        this.usuarioCosto=null;
        this.mailEnviado=false;
        this.fechaEnvio=null;
        this.situacionOcurrencia=null;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  