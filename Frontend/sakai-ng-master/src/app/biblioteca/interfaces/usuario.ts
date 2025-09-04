import { ClaseGeneral } from "./clase-general";

export class Usuario {
    id?: number=0;
    idUsuario?: number=0;
    rol?: ClaseGeneral;
    roles?: string[];
    numDocumento?: number;
    tipoDocumento?: number;
    nombreUsuario?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    password?: string;
    sede?: ClaseGeneral;
    idEstado?: string;
    tipodocumento?: ClaseGeneral;
    idtipodocumento?: number;
    numerodocumento?: string;
    numeroDocumento?: string;
    nombres?: string;
    email?: string;
    login?: string;
    telefono?: string;
    celular?: string;
    direccion?: string;
    fecharegistro?: string;
    fechamodificacion?: string;
    displayname?: string;
    givenname?: string;
    surname?: string;
    userprincipalname?: string;
    activo?: boolean;
    codigo?: string;
    foto?: string;
    registrado?:number;
    tipoUsuario?: string;
    tipoUsuarioCodigo?: string;
    constructor(init?: Partial<Usuario>) {
        this.id = 0;
        this.rol=new ClaseGeneral();
        this.sede=new ClaseGeneral();
        this.tipodocumento=new ClaseGeneral();
        this.numerodocumento='';
        this.numeroDocumento='';
        this.nombres='';
        this.apellidoPaterno='';
        this.apellidoMaterno='';
        this.email='';
        this.password='';
        this.telefono='';
        this.celular='';
        this.direccion='';
        this.fecharegistro='';
        this.fechamodificacion='';
        this.displayname='';
        this.givenname='';
        this.surname='';
        this.userprincipalname='';
        this.activo=false;
        this.codigo='';
        this.foto='';
        this.registrado=0;
        this.tipoUsuario='';
        this.tipoUsuarioCodigo='';
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
}
