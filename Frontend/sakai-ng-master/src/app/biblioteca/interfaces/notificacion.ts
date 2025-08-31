export class Notificacion {
  id: number;
  usuarioDestino: string;
  mensaje: string;
  fechaCreacion: string;  // o Date según tu JSON
  leida: boolean;

  constructor(init?: Partial<Notificacion>) {
    this.id = 0;
    this.usuarioDestino = '';
    this.mensaje = '';
    this.fechaCreacion = '';
    this.leida = false;
    Object.assign(this, init);
  }
}
