export interface FiltroCabecera {
  etiqueta: string;
  valor?: string | number;
  defecto?: string;
}

export interface CabeceraFiltros {
  etiquetas: string[];
  valores: (string | number)[];
}

export function construirCabeceraFiltros(filtros: FiltroCabecera[]): CabeceraFiltros {
  return {
    etiquetas: filtros.map((f) => f.etiqueta),
    valores: filtros.map((f) => f.valor ?? f.defecto ?? 'Todos')
  };
}

export function formatearFecha(fecha?: Date): string | undefined {
  return fecha ? fecha.toLocaleDateString() : undefined;
}
