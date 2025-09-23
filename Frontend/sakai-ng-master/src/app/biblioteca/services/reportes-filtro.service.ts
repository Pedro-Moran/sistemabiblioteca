import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GenericoService } from './generico.service';
import { MaterialBibliograficoService } from './material-bibliografico.service';
import { AuthService } from './auth.service';
import { Sedes } from '../interfaces/sedes';
import { ClaseGeneral } from '../interfaces/clase-general';

@Injectable({
  providedIn: 'root'
})
export class ReportesFiltroService {
  private cacheSedes: Sedes[] | null = null;
  private cacheTipoMaterial: ClaseGeneral[] | null = null;
  private cacheEspecialidad: ClaseGeneral[] | null = null;
  private cachePrograma: ClaseGeneral[] | null = null;
  private cacheCiclo: ClaseGeneral[] | null = null;
  private cacheTipoUsuario: ClaseGeneral[] | null = null;

  constructor(
    private genericoService: GenericoService,
    private materialService: MaterialBibliograficoService,
    private authService: AuthService
  ) {}

  async getSedes(): Promise<Sedes[]> {
    if (!this.cacheSedes) {
      try {
        const res: any = await firstValueFrom(
          this.genericoService.sedes_get('sede/lista-activo')
        );
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        this.cacheSedes = [
          new Sedes({ id: 0, descripcion: 'Todos', activo: true }),
          ...list.map(
            (s: any) =>
              new Sedes({
                id: s.idSede ?? s.id ?? s.codigo ?? 0,
                descripcion:
                  s.descripcion ?? s.nombre ?? s.descripcionSede ?? '',
                activo: s.activo ?? true,
              })
          )
        ];
      } catch {
        this.cacheSedes = [
          new Sedes({ id: 0, descripcion: 'Todos', activo: true })
        ];
      }
    }
    return this.cacheSedes ?? [];
  }

  async getTiposMaterial(): Promise<ClaseGeneral[]> {
    if (!this.cacheTipoMaterial) {
      try {
        const res: any = await firstValueFrom(
          this.materialService.lista_tipo_material('catalogos/tipomaterial/activos')
        );
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        this.cacheTipoMaterial = list.map(
          (t: any) =>
            new ClaseGeneral({
              id: t.tipo?.id ?? t.id,
              descripcion: t.descripcion,
              activo: t.activo ?? true,
              estado: 1,
            })
        );
      } catch {
        this.cacheTipoMaterial = [];
      }
    }
    return this.cacheTipoMaterial ?? [];
  }

  async getEspecialidades(): Promise<ClaseGeneral[]> {
    if (!this.cacheEspecialidad) {
      try {
        const res: any[] = await firstValueFrom(this.authService.getEspecialidades());
        this.cacheEspecialidad = [
          new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
          ...res.map(
            (e) =>
              new ClaseGeneral({
                id: e.idEspecialidad,
                descripcion: e.descripcion,
                activo: true,
                estado: 1,
              })
          ),
        ];
      } catch {
        this.cacheEspecialidad = [
          new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
        ];
      }
    }
    return this.cacheEspecialidad ?? [];
  }

  async getProgramas(): Promise<ClaseGeneral[]> {
    if (!this.cachePrograma) {
      try {
        const res: any[] = await firstValueFrom(this.authService.getProgramas());
        this.cachePrograma = [
          new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
          ...res.map(
            (p) =>
              new ClaseGeneral({
                id: p.idPrograma,
                descripcion: p.descripcionPrograma,
                activo: true,
                estado: 1,
              })
          ),
        ];
      } catch {
        this.cachePrograma = [
          new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
        ];
      }
    }
    return this.cachePrograma ?? [];
  }

  async getCiclos(): Promise<ClaseGeneral[]> {
    if (!this.cacheCiclo) {
      const romanos = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
        'XI',
        'XII',
        'XIII',
        'XIV',
        'XV'
      ];

      this.cacheCiclo = [
        new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
        ...romanos.map(
          (descripcion, idx) =>
            new ClaseGeneral({
              id: idx + 1,
              descripcion,
              activo: true,
              estado: 1
            })
        )
      ];
    }
    return this.cacheCiclo ?? [];
  }

  async getTiposUsuario(): Promise<ClaseGeneral[]> {
    if (!this.cacheTipoUsuario) {
      try {
        const res: any = await firstValueFrom(
          this.genericoService.tipo_get('api/prestamos/tipos-usuario')
        );
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        this.cacheTipoUsuario = [
          new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
          ...list.map(
            (r: any) =>
              new ClaseGeneral({
                id: r.idRol ?? r.id ?? r.codigo,
                descripcion: r.descripcion,
                activo: r.activo ?? true,
                estado: 1,
              })
          ),
        ];
      } catch {
        this.cacheTipoUsuario = [
          new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 }),
        ];
      }
    }
    return this.cacheTipoUsuario ?? [];
  }

  async cargarFiltros(): Promise<{ sedes: Sedes[]; tiposMaterial: ClaseGeneral[]; especialidades: ClaseGeneral[]; programas: ClaseGeneral[]; ciclos: ClaseGeneral[]; tipoUsuarios: ClaseGeneral[] }> {
    const [sedes, tiposMaterial, especialidades, programas, ciclos, tipoUsuarios] = await Promise.all([
      this.getSedes(),
      this.getTiposMaterial(),
      this.getEspecialidades(),
      this.getProgramas(),
      this.getCiclos(),
      this.getTiposUsuario()
    ]);
    return { sedes, tiposMaterial, especialidades, programas, ciclos, tipoUsuarios };
  }
}
