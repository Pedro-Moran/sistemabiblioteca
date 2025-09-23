// src/main/java/com/miapp/mapper/BibliotecaManualMapper.java
package com.miapp.mapper;

import com.miapp.model.dto.*;
import org.springframework.stereotype.Component;
import com.miapp.model.*;
import com.miapp.repository.EstadoRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BibliotecaMapper {
    private final EstadoRepository estadoRepository;
    // DTO -> Entidad
    public Biblioteca toEntity(BibliotecaDTO dto) {
        Biblioteca b = new Biblioteca();
        b.setCodigoLocalizacion(dto.getCodigoLocalizacion());
        b.setAutorPersonal(dto.getAutorPersonal());
        b.setAutorInstitucional(dto.getAutorInstitucional());
        b.setAutorSecundario(dto.getAutorSecundario());
        b.setTraductor(dto.getTraductor());
        b.setDirector(dto.getDirector());
        b.setCompilador(dto.getCompilador());
        b.setCoordinador(dto.getCoordinador());
        b.setProductor(dto.getProductor());
        b.setTitulo(dto.getTitulo());
        b.setTituloAnterior(dto.getTituloAnterior());
        b.setEditorialPublicacion(dto.getEditorialPublicacion());
        b.setTipoAnioPublicacion(dto.getTipoAnioPublicacion());
        b.setAnioPublicacion(dto.getAnioPublicacion());
        b.setIsbn(dto.getIsbn());
        b.setIssn(dto.getIssn());
        b.setSerie(dto.getSerie());
        b.setTipoReproduccion(dto.getTipoReproduccion());
        b.setTipoConteo(dto.getTipoConteo());
        b.setNumeroConteo(dto.getNumeroConteo());
        b.setNumeroConteo2(dto.getNumeroConteo2());
        b.setEdicion(dto.getEdicion());
        b.setReimpresion(dto.getReimpresion());
        b.setDescriptor(dto.getDescriptor());
        b.setDescripcionRevista(dto.getDescripcionRevista());
        b.setNotaContenido(dto.getNotaContenido());
        b.setNotaGeneral(dto.getNotaGeneral());
        b.setNotaResumen(dto.getNotaResumen());
        b.setLinkPublicacion(dto.getLinkPublicacion());
        b.setNumeroPaginas(dto.getNumeroPaginas());
        b.setFechaIngreso(dto.getFechaIngreso());
        b.setCosto(dto.getCosto());
        b.setNumeroFactura(dto.getNumeroFactura());
        b.setExistencias(dto.getExistencias());
        b.setNumeroExpediente(dto.getNumeroExpediente());
        b.setJuzgado(dto.getJuzgado());
        b.setFechaInicioExpediente(dto.getFechaInicioExpediente());
        b.setMotivo(dto.getMotivo());
        b.setProceso(dto.getProceso());
        b.setMateria(dto.getMateria());
        b.setObservacion(dto.getObservacion());
        b.setDemandado(dto.getDemandado());
        b.setDemandante(dto.getDemandante());
        b.setRutaImagen(dto.getRutaImagen());
        b.setNombreImagen(dto.getNombreImagen());
        b.setFlasyllabus(dto.getFlasyllabus());
        b.setFladigitalizado(dto.getFladigitalizado());
        b.setUsuarioCreacion(dto.getUsuarioCreacion());
        b.setFechaCreacion(dto.getFechaCreacion());
        b.setUsuarioModificacion(dto.getUsuarioModificacion());
        b.setFechaModificacion(dto.getFechaModificacion());
        b.setIdEstado(dto.getEstadoId());

        if (dto.getTipoBibliotecaId() != null) {
            TipoBiblioteca tb = new TipoBiblioteca();
            tb.setId(dto.getTipoBibliotecaId());
            b.setTipoBiblioteca(tb);
        }
        if (dto.getIdiomaId() != null) {
            Idioma idioma = new Idioma();
            idioma.setId(dto.getIdiomaId());
            b.setIdioma(idioma);
        }
        if (dto.getPaisId() != null) {
            Pais pais = new Pais();
            pais.setPaisId(dto.getPaisId());
            b.setPais(pais);
        }
        if (dto.getCiudadCodigo() != null) {
            Ciudad ciudad = new Ciudad();
            ciudad.setCodigoCiudad(dto.getCiudadCodigo());
            b.setCiudad(ciudad);
        }
        if (dto.getPeriodicidadId() != null) {
            Periodicidad per = new Periodicidad();
            per.setId(dto.getPeriodicidadId());
            b.setPeriodicidad(per);
        }
        if (dto.getSedeId() != null) {
            Sede sede = new Sede();
            sede.setId(dto.getSedeId());
            b.setSede(sede);
        }
        if (dto.getTipoAdquisicionId() != null) {
            TipoAdquisicion ta = new TipoAdquisicion();
            ta.setId(dto.getTipoAdquisicionId());
            b.setTipoAdquisicion(ta);
        }

        if (dto.getCiclos() != null) {
            List<BibliotecaCiclo> ciclos = dto.getCiclos().stream()
                    .distinct()
                    .map(c -> {
                        BibliotecaCiclo bc = new BibliotecaCiclo();
                        bc.setCiclo(c);
                        bc.setBiblioteca(b);
                        bc.setIdEstado(1L);
                        return bc;
                    }).collect(Collectors.toList());
            b.setCiclos(ciclos);
        }

        return b;
    }

    // Entidad -> DTO
    public BibliotecaDTO toDto(Biblioteca b) {
        BibliotecaDTO dto = new BibliotecaDTO();
        dto.setCodigoLocalizacion(b.getCodigoLocalizacion());
        dto.setAutorPersonal(b.getAutorPersonal());
        dto.setAutorInstitucional(b.getAutorInstitucional());
        dto.setAutorSecundario(b.getAutorSecundario());
        dto.setTraductor(b.getTraductor());

        dto.setDirector(b.getDirector());
        dto.setCompilador(b.getCompilador());
        dto.setCoordinador(b.getCoordinador());
        dto.setProductor(b.getProductor());
        dto.setTitulo(b.getTitulo());
        dto.setTituloAnterior(b.getTituloAnterior());
        dto.setEditorialPublicacion(b.getEditorialPublicacion());
        dto.setTipoAnioPublicacion(b.getTipoAnioPublicacion());
        dto.setAnioPublicacion(b.getAnioPublicacion());
        dto.setIsbn(b.getIsbn());
        dto.setIssn(b.getIssn());
        dto.setSerie(b.getSerie());
        dto.setTipoReproduccion(b.getTipoReproduccion());
        dto.setTipoConteo(b.getTipoConteo());
        dto.setNumeroConteo(b.getNumeroConteo());
        dto.setNumeroConteo2(b.getNumeroConteo2());
        dto.setEdicion(b.getEdicion());
        dto.setReimpresion(b.getReimpresion());
        dto.setDescriptor(b.getDescriptor());
        dto.setDescripcionRevista(b.getDescripcionRevista());
        dto.setNotaContenido(b.getNotaContenido());
        dto.setNotaGeneral(b.getNotaGeneral());
        dto.setNotaResumen(b.getNotaResumen());
        dto.setLinkPublicacion(b.getLinkPublicacion());
        dto.setNumeroPaginas(b.getNumeroPaginas());
        dto.setNumeroDeIngreso(b.getNumeroDeIngreso());
        dto.setFechaIngreso(b.getFechaIngreso());
        dto.setCosto(b.getCosto());
        dto.setNumeroFactura(b.getNumeroFactura());
        dto.setExistencias(b.getExistencias());
        dto.setNumeroExpediente(b.getNumeroExpediente());
        dto.setJuzgado(b.getJuzgado());
        dto.setFechaInicioExpediente(b.getFechaInicioExpediente());
        dto.setMotivo(b.getMotivo());
        dto.setProceso(b.getProceso());
        dto.setMateria(b.getMateria());
        dto.setObservacion(b.getObservacion());
        dto.setDemandado(b.getDemandado());
        dto.setDemandante(b.getDemandante());
        dto.setRutaImagen(b.getRutaImagen());
        dto.setNombreImagen(b.getNombreImagen());
        dto.setFlasyllabus(b.getFlasyllabus());
        dto.setFladigitalizado(b.getFladigitalizado());
        dto.setUsuarioCreacion(b.getUsuarioCreacion());
        dto.setFechaCreacion(b.getFechaCreacion());
        dto.setUsuarioModificacion(b.getUsuarioModificacion());
        dto.setFechaModificacion(b.getFechaModificacion());
        dto.setEstadoId(b.getIdEstado());
        if (b.getIdEstado() != null) {
            estadoRepository.findById(b.getIdEstado())
                    .ifPresent(e -> dto.setEstadoDescripcion(e.getDescripcion()));
        }

        if (b.getTipoBiblioteca() != null) dto.setTipoBibliotecaId(b.getTipoBiblioteca().getId());
        if (b.getIdioma()         != null) dto.setIdiomaId(b.getIdioma().getId());
        if (b.getPais() != null) {
            dto.setPaisId(b.getPais().getPaisId());
            dto.setPais(new com.miapp.model.dto.PaisDTO(
                    b.getPais().getCodigoPais(),
                    b.getPais().getNombrePais()
            ));
        }
        if (b.getCiudad() != null) {
            dto.setCiudadCodigo(b.getCiudad().getCodigoCiudad());
            dto.setCiudad(new com.miapp.model.dto.CiudadDTO(
                    b.getCiudad().getCodigoCiudad(),
                    b.getCiudad().getNombreCiudad(),
                    b.getCiudad().getPais().getCodigoPais()
            ));
        }
        if (b.getPeriodicidad()   != null) dto.setPeriodicidadId(b.getPeriodicidad().getId());
        if (b.getSede() != null) {
            dto.setSedeId(b.getSede().getId());
            dto.setSede(new SedeDTO(
                    b.getSede().getId(),
                    b.getSede().getDescripcion(),
                    b.getSede().getActivo()
            ));
        }
        if (b.getTipoAdquisicion() != null) {
            dto.setTipoAdquisicionId(b.getTipoAdquisicion().getId());
            dto.setTipoAdquisicion(new TipoAdquisicionDTO(
                    b.getTipoAdquisicion().getId(),
                    b.getTipoAdquisicion().getDescripcion(),
                    null
            ));
        }
        if (b.getTipoMaterial()   != null) dto.setTipoMaterialId(b.getTipoMaterial().getIdTipoMaterial());
        if (b.getEspecialidad() != null) {
            dto.setIdEspecialidad(b.getEspecialidad().getIdEspecialidad());
            dto.setEspecialidad(new EspecialidadDTO(
                    b.getEspecialidad().getIdEspecialidad(),
                    b.getEspecialidad().getCodigoEspecialidad(),
                    b.getEspecialidad().getDescripcion(),
                    b.getEspecialidad().getPrograma() != null
                            ? b.getEspecialidad().getPrograma().getIdPrograma()
                            : null,
                    b.getEspecialidad().getPrograma() != null
                            ? b.getEspecialidad().getPrograma().getPrograma()
                            : null,
                    b.getEspecialidad().getPrograma() != null
                            ? b.getEspecialidad().getPrograma().getDescripcionPrograma()
                            : null
            ));
        }
        if (b.getCiclos() != null) {
            dto.setCiclos(
                    b.getCiclos().stream()
                            .map(BibliotecaCiclo::getCiclo)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }


    public List<BibliotecaDTO> toDtoList(List<Biblioteca> list) {
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public DetalleBibliotecaDTO toDetalleDto(DetalleBiblioteca d) {
        DetalleBibliotecaDTO tmp = new DetalleBibliotecaDTO();

        // 1) ID del detalle:
        tmp.setIdDetalleBiblioteca(d.getIdDetalle());

        // 2) Biblioteca padre (para saber a qué cabecera pertenece):
        Biblioteca padre = d.getBiblioteca();
        if (padre != null) {
            tmp.setBibliotecaId(padre.getId());

            // Ahora construimos un DTO de “resumen” para enviar solo algunos campos de la cabecera:
            BibliotecaResumenDTO resumen = new BibliotecaResumenDTO();
            resumen.setId(padre.getId());
            resumen.setCodigoLocalizacion(padre.getCodigoLocalizacion());
            resumen.setTipoBibliotecaId(
                    padre.getTipoBiblioteca() != null ? padre.getTipoBiblioteca().getId() : null
            );
            resumen.setAutorPersonal(padre.getAutorPersonal());
            resumen.setAutorInstitucional(padre.getAutorInstitucional());
            resumen.setAutorSecundario(padre.getAutorSecundario());
            resumen.setTraductor(padre.getTraductor());
            resumen.setDirector(padre.getDirector());
            resumen.setCoordinador(padre.getCoordinador());
            resumen.setCompilador(padre.getCompilador());
            resumen.setProductor(padre.getProductor());
            resumen.setTitulo(padre.getTitulo());
            resumen.setTituloAnterior(padre.getTituloAnterior());
            resumen.setEditorialPublicacion(padre.getEditorialPublicacion());
            resumen.setTipoAnioPublicacion(padre.getTipoAnioPublicacion());
            resumen.setAnioPublicacion(padre.getAnioPublicacion());
            resumen.setIdEspecialidad(
                    padre.getEspecialidad() != null ? padre.getEspecialidad().getIdEspecialidad() : null
            );
            resumen.setIsbn(padre.getIsbn());
            resumen.setIssn(padre.getIssn());
            resumen.setSerie(padre.getSerie());
            resumen.setTipoReproduccion(padre.getTipoReproduccion());
            resumen.setTipoConteo(padre.getTipoConteo());
            resumen.setNumeroConteo(padre.getNumeroConteo());
            resumen.setNumeroConteo2(padre.getNumeroConteo2());
            resumen.setEdicion(padre.getEdicion());
            resumen.setReimpresion(padre.getReimpresion());
            resumen.setDescriptor(padre.getDescriptor());
            resumen.setDescripcionRevista(padre.getDescripcionRevista());
            resumen.setNotaContenido(padre.getNotaContenido());
            resumen.setNotaGeneral(padre.getNotaGeneral());
            resumen.setNotaResumen(padre.getNotaResumen());
            resumen.setIdiomaId(padre.getIdioma() != null ? padre.getIdioma().getId() : null);
            resumen.setPaisId(
                    padre.getPais() != null ? padre.getPais().getPaisId() : null
            );
            resumen.setCiudadCodigo(
                    padre.getCiudad() != null ? padre.getCiudad().getCodigoCiudad() : null
            );
            resumen.setPeriodicidadId(
                    padre.getPeriodicidad() != null ? padre.getPeriodicidad().getId() : null
            );
            resumen.setNumeroExpediente(padre.getNumeroExpediente());
            resumen.setJuzgado(padre.getJuzgado());
            resumen.setFechaInicioExpediente(padre.getFechaInicioExpediente());
            resumen.setMotivo(padre.getMotivo());
            resumen.setProceso(padre.getProceso());
            resumen.setMateria(padre.getMateria());
            resumen.setObservacion(padre.getObservacion());
            resumen.setDemandado(padre.getDemandado());
            resumen.setDemandante(padre.getDemandante());
            resumen.setRutaImagen(padre.getRutaImagen());
            resumen.setNombreImagen(padre.getNombreImagen());
            resumen.setEstadoId(padre.getIdEstado());
            if (padre.getIdEstado() != null) {
                estadoRepository.findById(padre.getIdEstado())
                        .ifPresent(e -> resumen.setEstadoDescripcion(e.getDescripcion()));
            }
            resumen.setFlasyllabus(padre.getFlasyllabus());
            resumen.setFladigitalizado(padre.getFladigitalizado());
            resumen.setLinkPublicacion(padre.getLinkPublicacion());
            resumen.setNumeroPaginas(padre.getNumeroPaginas());
            resumen.setNumeroDeIngreso(padre.getNumeroDeIngreso());
            resumen.setSedeId(padre.getSede() != null ? padre.getSede().getId() : null);
            resumen.setTipoAdquisicionId(
                    padre.getTipoAdquisicion() != null ? padre.getTipoAdquisicion().getId() : null
            );
            resumen.setFechaIngreso(padre.getFechaIngreso());
            resumen.setCosto(padre.getCosto());
            resumen.setNumeroFactura(padre.getNumeroFactura());
            resumen.setExistencias(padre.getExistencias());
            resumen.setUsuarioCreacion(padre.getUsuarioCreacion());
            resumen.setFechaCreacion(padre.getFechaCreacion());
            resumen.setUsuarioModificacion(padre.getUsuarioModificacion());
            resumen.setFechaModificacion(padre.getFechaModificacion());
            resumen.setTipoMaterialId(
                    padre.getTipoMaterial() != null ? padre.getTipoMaterial().getIdTipoMaterial() : null
            );

            // Finalmente lo asignamos al DTO:
            tmp.setBiblioteca(resumen);
        } else {
            // Si no había ninguna biblioteca asociada (lo cual no debería pasar
            // si la FK está bien rellena), simplemente dejamos 'biblioteca' como null.
            tmp.setBiblioteca(null);
        }

        // 3) Código de sede, tipoMaterial, tipoAdquisición, etc.
        tmp.setCodigoSede(d.getSede() != null ? d.getSede().getId() : null);
        if (d.getSede() != null) {
            tmp.setSede(new SedeDTO(
                    d.getSede().getId(),
                    d.getSede().getDescripcion(),
                    d.getSede().getActivo()
            ));
        } else {
            tmp.setSede(null);
        }
        tmp.setTipoAdquisicionId(
                d.getTipoAdquisicion() != null ? d.getTipoAdquisicion().getId() : null
        );
        if (d.getTipoAdquisicion() != null) {
            tmp.setTipoAdquisicion(new com.miapp.model.TipoAdquisicionDTO(
                    d.getTipoAdquisicion().getId(),
                    d.getTipoAdquisicion().getDescripcion(),
                    null
            ));
        } else {
            tmp.setTipoAdquisicion(null);
        }
        if (d.getTipoAdquisicion() != null) {
            tmp.setTipoAdquisicion(new TipoAdquisicionDTO(
                    d.getTipoAdquisicion().getId(),
                    d.getTipoAdquisicion().getDescripcion(),
                    null
            ));
        } else {
            tmp.setTipoAdquisicion(null);
        }
        tmp.setTipoMaterialId(
                d.getTipoMaterial() != null ? d.getTipoMaterial().getIdTipoMaterial() : null
        );
        if (d.getTipoMaterial() != null) {
            tmp.setTipoMaterial(new TipoMaterialDTO(
                    d.getTipoMaterial().getIdTipoMaterial(),
                    d.getTipoMaterial().getDescripcion(),
                    d.getTipoMaterial().getActivo()
            ));
        } else {
            tmp.setTipoMaterial(null);
        }
        tmp.setCosto(d.getCosto());
        tmp.setNumeroFactura(d.getNumeroFactura());
        tmp.setCodigoUsuario(d.getCodigoUsuario());
        tmp.setCodigoPrograma(d.getCodigoPrograma());
        tmp.setCodigoEspecialidad(d.getCodigoEspecialidad());
        tmp.setCodigoCiclo(d.getCodigoCiclo());
        tmp.setTipoPrestamo(d.getTipoPrestamo());
        tmp.setHoraInicio(d.getHoraInicio());
        tmp.setHoraFin(d.getHoraFin());
        tmp.setMaxHoras(d.getMaxHoras());
        tmp.setFechaIngreso(d.getFechaIngreso());
        tmp.setCodigoBarra(d.getCodigoBarra());
        tmp.setNumeroIngreso(d.getNumeroIngreso());
        tmp.setNroExistencia(d.getNroExistencia());
        tmp.setUsuarioIngreso(d.getUsuarioIngreso());
        tmp.setUsuarioAceptacion(d.getUsuarioAceptacion());
        tmp.setFechaAceptacion(d.getFechaAceptacion());
        tmp.setUsuarioCreacion(d.getUsuarioCreacion());
        tmp.setFechaCreacion(d.getFechaCreacion());
        tmp.setUsuarioModificacion(d.getUsuarioModificacion());
        tmp.setFechaModificacion(d.getFechaModificacion());
        tmp.setIdEstado(d.getIdEstado());
        if (d.getIdEstado() != null) {
            estadoRepository.findById(d.getIdEstado())
                    .ifPresent(e -> tmp.setEstadoDescripcion(e.getDescripcion()));
        }
        tmp.setEstadoInventario(d.getEstadoInventario());
        tmp.setFechaVerificacion(d.getFechaVerificacion());
        tmp.setUsuarioVerificacion(d.getUsuarioVerificacion());
        tmp.setCantidadPrestamos(d.getCantidadPrestamos());
        // Combinar fecha y hora para exponer un LocalDateTime completo
        LocalDateTime fPrestamo = null;
        if (d.getFechaInicio() != null) {
            LocalTime hi = d.getHoraInicio() != null ? LocalTime.parse(d.getHoraInicio()) : LocalTime.MIDNIGHT;
            fPrestamo = LocalDateTime.of(d.getFechaInicio(), hi);
        } else if (d.getFechaPrestamo() != null) {
            fPrestamo = d.getFechaPrestamo();
        }
        tmp.setFechaPrestamo(fPrestamo);

        LocalDateTime fDevolucion = null;
        if (d.getFechaFin() != null) {
            LocalTime hf = d.getHoraFin() != null ? LocalTime.parse(d.getHoraFin()) : LocalTime.MIDNIGHT;
            fDevolucion = LocalDateTime.of(d.getFechaFin(), hf);
        }
        tmp.setFechaDevolucion(fDevolucion);

        tmp.setFechaReserva(d.getFechaSolicitud());

        return tmp;
    }
}
