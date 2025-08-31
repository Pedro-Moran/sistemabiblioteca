import { ClaseGeneral } from "./clase-general";
import { Ejemplar } from "./detalle";
import { Recurso } from "./recurso";
import { Usuario } from "./usuario";

export class Prestamo {
    id: number;
    usuario: Usuario;
    ejemplar:Ejemplar;
    situacionReserva:ClaseGeneral;
    fechaRegistro:Date;
    fechaHoraInicio:String;
    fechaHoraFin:String;
    motivo:string;
    constructor(init?: Partial<Prestamo>) {
        this.id = 0;
        this.usuario=new Usuario();
        this.ejemplar=new Ejemplar();
        this.situacionReserva=new ClaseGeneral();
        this.fechaRegistro=new Date();
        this.fechaHoraInicio="";
        this.fechaHoraFin="";
        this.motivo="";
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  