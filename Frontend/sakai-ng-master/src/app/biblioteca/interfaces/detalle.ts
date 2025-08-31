import { ClaseGeneral } from "./clase-general";
import { EstadoRecurso } from "./estado-recurso";
import { Material } from "./material";
import { Sedes } from "./sedes";
import { TipoRecurso } from "./tipo-recurso";
import { Especialidad } from "./material-bibliografico/especialidad";
import { Pais } from "./material-bibliografico/pais";

export class Ejemplar {
    id: number;
    idEquipo: number;
    material: Material;
    sede: Sedes | null;
    estado:EstadoRecurso| null;
    tipoEjemplar : ClaseGeneral| null;
    fechaRegistro: string;
    codigo:string;
    nroingreso: string;
    activo: boolean;
    autorPersonal?: string;
    especialidad?: Especialidad;
    codigoLocalizacion?: string;
    titulo?: string;
    constructor(init?: Partial<Ejemplar>) {
        this.id = 0;
        this.idEquipo = 0;
        this.material=new Material();
        this.sede=null;
        this.estado=null;
        this.tipoEjemplar=null;
        this.fechaRegistro='';
        this.codigo='';
        this.nroingreso='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
