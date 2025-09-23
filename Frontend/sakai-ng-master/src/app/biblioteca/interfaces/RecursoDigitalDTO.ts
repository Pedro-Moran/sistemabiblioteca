export interface RecursoDigitalDTO {
 id?: number;
   autor: string;
   titulo: string;
   tipoId?: number;
   descripcion: string;
   tipoDescripcion?: string;
   enlace: string;
   estado: number;               // 1 = activo, 0 = inactivo
   usuarioCreacion?: string;
   usuarioModificacion?: string;
   fechaCreacion?: string;       // ISO string
   fechaModificacion?: string;   // ISO string
   imagen?: string;              // base64 o URL, se mapea directamente del campo 'imagen'
   imagenUrl?: string;           // URL pública entregada por el backend
   clicks?: number;
}
