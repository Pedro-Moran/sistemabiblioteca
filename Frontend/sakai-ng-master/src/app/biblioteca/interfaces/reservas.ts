import { StringNullableChain } from "lodash";
import { ClaseGeneral } from "./clase-general";
import { Recurso } from "./recurso";
import { Usuario } from "./usuario";

export class Reservas {
    id: number;
    usuario: Usuario;
    recurso:Recurso | null;
    situacionReserva:ClaseGeneral;
    fechaRegistro:Date;
    fechaHoraInicio:String;
    fechaHoraFin:String;
    motivo:string;
    constructor(init?: Partial<Reservas>) {
        this.id = 0;
        this.usuario=new Usuario();
        this.recurso=new Recurso();
        this.situacionReserva=new ClaseGeneral();
        this.fechaRegistro=new Date();
        this.fechaHoraInicio="";
        this.fechaHoraFin="";
        this.motivo="";
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  