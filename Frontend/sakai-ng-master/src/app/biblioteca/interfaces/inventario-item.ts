export interface InventarioItem {
    id: number;
    codigoBarra?: string | null;
    codigoLocalizacion?: string | null;
    titulo?: string | null;
    autor?: string | null;
    estadoInventario?: string | null;
    fechaVerificacion?: string | null;
    usuarioVerificacion?: string | null;
}

export type EstadoInventario = 'ENCONTRADO' | 'NO_ENCONTRADO' | 'PENDIENTE' | 'POR_VERIFICAR' | string;
