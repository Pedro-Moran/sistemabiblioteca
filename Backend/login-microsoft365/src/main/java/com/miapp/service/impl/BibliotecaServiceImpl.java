package com.miapp.service.impl;

import com.miapp.mapper.BibliotecaMapper;
import com.miapp.model.*;
import com.miapp.model.dto.*;
import com.miapp.repository.*;
import com.miapp.service.BibliotecaService;
import com.miapp.service.EmailService;
import com.miapp.service.NotificacionService;
import com.miapp.service.FileStorageService;
import com.miapp.service.ProgramaMotivoAccionService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BibliotecaServiceImpl implements BibliotecaService {

    private final BibliotecaRepository bibliotecaRepository;
    private final TipoAdquisicionRepository tipoAdquisicionRepository;
    private final EspecialidadRepository especialidadRepository;
    private final PaisRepository paisRepository;
    private final CiudadRepository ciudadRepository;
    private final IdiomaRepository idiomaRepository;
    private final TipoMaterialRepository tipoMaterialRepository;
    private final SedeRepository sedeRepository;
    private final DetalleBibliotecaRepository detalleBibliotecaRepository;
    private final BibliotecaMapper mapper;
    private final OcurrenciaUsuarioRepository repoU;
    private final OcurrenciaMaterialRepository repoM;
    private final OcurrenciaBibliotecaRepository ocurrenciaBibliotecaRepository;
    private final NotificacionService notificacionService;
    private final EmailService emailService;
    private final FileStorageService fileStorageService;
    private final BibliotecaCicloRepository bibliotecaCicloRepository;
    private final PeriodicidadRepository periodicidadRepository;
    private final ProgramaMotivoAccionService programaMotivoAccionService;

    public BibliotecaServiceImpl(BibliotecaRepository bibliotecaRepository,
                                 TipoAdquisicionRepository tipoAdquisicionRepository,
                                 EspecialidadRepository especialidadRepository,
                                 PaisRepository paisRepository,
                                 CiudadRepository ciudadRepository,
                                 IdiomaRepository idiomaRepository,
                                 TipoMaterialRepository tipoMaterialRepository,
                                 SedeRepository sedeRepository,
                                 DetalleBibliotecaRepository detalleBibliotecaRepository,
                                 BibliotecaMapper mapper,
                                 OcurrenciaUsuarioRepository repoU,
                                 OcurrenciaMaterialRepository repoM,
                                 OcurrenciaBibliotecaRepository ocurrenciaBibliotecaRepository,
                                 NotificacionService notificacionService,
                                 EmailService emailService,
                                 FileStorageService fileStorageService,
                                 BibliotecaCicloRepository bibliotecaCicloRepository,
                                 PeriodicidadRepository periodicidadRepository,
                                 ProgramaMotivoAccionService programaMotivoAccionService) {
        this.bibliotecaRepository = bibliotecaRepository;
        this.tipoAdquisicionRepository  = tipoAdquisicionRepository;
        this.especialidadRepository = especialidadRepository;
        this.paisRepository = paisRepository;
        this.ciudadRepository = ciudadRepository;
        this.idiomaRepository = idiomaRepository;
        this.tipoMaterialRepository = tipoMaterialRepository;
        this.sedeRepository = sedeRepository;
        this.detalleBibliotecaRepository = detalleBibliotecaRepository;
        this.mapper = mapper;
        this.repoU = repoU;
        this.repoM = repoM;
        this.ocurrenciaBibliotecaRepository = ocurrenciaBibliotecaRepository;
        this.notificacionService = notificacionService;
        this.emailService = emailService;
        this.fileStorageService = fileStorageService;
        this.bibliotecaCicloRepository = bibliotecaCicloRepository;
        this.periodicidadRepository = periodicidadRepository;
        this.programaMotivoAccionService = programaMotivoAccionService;
    }
    @Override
    public Biblioteca register(BibliotecaDTO dto, MultipartFile portada) {
        // 1) Mapea principal
        Biblioteca bib = mapToEntity(dto);

        Long numeroIngreso = generarNumeroIngreso();
        bib.setNumeroDeIngreso(numeroIngreso);
        if (bib.getDetalles() != null) {
            bib.getDetalles().forEach(d -> {
                if (d.getNumeroIngreso() == null) {
                    d.setNumeroIngreso(numeroIngreso);
                }
            });
        }
        if (portada != null && !portada.isEmpty()) {
            String filename = fileStorageService.store(portada);
            bib.setNombreImagen(filename);
            // solo guardamos el directorio base en rutaImagen
            bib.setRutaImagen("/uploads/recursos");
        }
        return bibliotecaRepository.save(bib);
    }

    @Override
    public Biblioteca update(Long id, BibliotecaDTO dto, MultipartFile portada) {
        Biblioteca existente = bibliotecaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe Biblioteca " + id));
        // Eliminamos los ciclos existentes para evitar duplicidades
        bibliotecaCicloRepository.deleteByBibliotecaId(id);
        // Volvemos a mapearlo por completo (incluyendo detalles)
        Biblioteca bib = mapToEntity(dto);
        bib.setId(id);
        bib.setNumeroDeIngreso(existente.getNumeroDeIngreso());
        if (bib.getDetalles() != null) {
            bib.getDetalles().forEach(d -> {
                if (d.getNumeroIngreso() == null) {
                    d.setNumeroIngreso(existente.getNumeroDeIngreso());
                }
            });
        }
        if (portada != null && !portada.isEmpty()) {
            String filename = fileStorageService.store(portada);
            bib.setNombreImagen(filename);
            // solo guardamos el directorio base en rutaImagen
            bib.setRutaImagen("/uploads/recursos");
        }
        return bibliotecaRepository.save(bib);
    }

    // delete y findById / listAll igual que antes…

    /***  Mapeo manual de DTO → Entidad ***/
    private Biblioteca mapToEntity(BibliotecaDTO dto) {
        Biblioteca b = new Biblioteca();

        // — campos principales —
        b.setId(dto.getId());
        b.setCodigoLocalizacion(dto.getCodigoLocalizacion());

        // **Aquí faltan estos mappings:**
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
        b.setDescriptor(dto.getDescriptor());
        b.setDescripcionRevista(dto.getDescripcionRevista());
        b.setNotaContenido(dto.getNotaContenido());
        b.setNotaGeneral(dto.getNotaGeneral());
        b.setSerie(dto.getSerie());
        b.setNumeroPaginas(dto.getNumeroPaginas());
        b.setEdicion(dto.getEdicion());
        b.setReimpresion(dto.getReimpresion());
        b.setIsbn(dto.getIsbn());
        b.setIssn(dto.getIssn());
        b.setRutaImagen(dto.getRutaImagen());
        b.setNombreImagen(dto.getNombreImagen());
        b.setFechaIngreso(dto.getFechaIngreso());
        b.setIdEstado(dto.getEstadoId());
        b.setExistencias(dto.getExistencias());
        // … asigna aquí todos tus campos de BibliotecaDTO a Biblioteca …
        if (dto.getIdEspecialidad() != null) {
            Especialidad e = especialidadRepository.findById(dto.getIdEspecialidad())
                    .orElseThrow(() -> new RuntimeException(
                            "Especialidad no encontrada: " + dto.getIdEspecialidad()));
            b.setEspecialidad(e);
        } else {
            b.setEspecialidad(null);
        }

        if (dto.getSedeId() != null) {
            Sede s = sedeRepository.findById(dto.getSedeId())
                    .orElseThrow(() -> new RuntimeException(
                            "Sede no encontrada: " + dto.getSedeId()));
            b.setSede(s);
        } else {
            b.setSede(null);
        }

        dto.setIdEspecialidad(
                b.getEspecialidad() != null
                        ? b.getEspecialidad().getIdEspecialidad()
                        : null
        );
        // **mapea País**
        if (dto.getPaisId() != null) {
            Pais p = paisRepository.findById(dto.getPaisId())
                    .orElseThrow(() -> new RuntimeException("País no encontrado: " + dto.getPaisId()));
            b.setPais(p);
        } else {
            b.setPais(null);
        }

        // **mapea Ciudad**
        if (dto.getCiudadCodigo() != null) {
            Ciudad c = ciudadRepository.findById(dto.getCiudadCodigo())
                    .orElseThrow(() -> new RuntimeException("Ciudad no encontrada: " + dto.getCiudadCodigo()));
            b.setCiudad(c);
        } else {
            b.setCiudad(null);
        }
        // **mapea Periodicidad**
        if (dto.getPeriodicidadId() != null) {
            Periodicidad p = periodicidadRepository.findById(dto.getPeriodicidadId())
                    .orElseThrow(() -> new RuntimeException("Periodicidad no encontrada: " + dto.getPeriodicidadId()));
            b.setPeriodicidad(p);
        } else {
            b.setPeriodicidad(null);
        }

        // **mapea Idioma**
        if (dto.getIdiomaId() != null) {
            Idioma i = idiomaRepository.findById(dto.getIdiomaId())
                    .orElseThrow(() -> new RuntimeException("Idioma no encontrado: " + dto.getIdiomaId()));
            b.setIdioma(i);
        }

        if (dto.getIdEspecialidad() != null) {
            Especialidad esp = especialidadRepository
                    .findById(dto.getIdEspecialidad())
                    .orElseThrow(() -> new RuntimeException(
                            "Especialidad no encontrada: " + dto.getIdEspecialidad()));
            b.setEspecialidad(esp);
        } else {
            b.setEspecialidad(null);
        }
        if (dto.getTipoMaterialId() != null) {
            TipoMaterial tm = tipoMaterialRepository
                    .findById(dto.getTipoMaterialId())
                    .orElseThrow(() -> new RuntimeException("TipoMaterial no encontrado: " + dto.getTipoMaterialId()));
            b.setTipoMaterial(tm);
        }
        b.getCiclos().clear();
        if (dto.getCiclos() != null) {
            List<BibliotecaCiclo> ciclos = dto.getCiclos().stream()
                    .map(c -> {
                        BibliotecaCiclo bc = new BibliotecaCiclo();
                        bc.setCiclo(c);
                        bc.setBiblioteca(b);
                        bc.setIdEstado(1L);
                        return bc;
                    }).collect(Collectors.toList());
            b.getCiclos().addAll(ciclos);
        }

        List<DetalleBiblioteca> lista = dto.getDetalles() == null
                ? List.of()
                : dto.getDetalles().stream().map(det -> {
            DetalleBiblioteca e;
            if (det.getIdDetalleBiblioteca() != null) {
                e = detalleBibliotecaRepository.findById(det.getIdDetalleBiblioteca())
                        .orElseGet(DetalleBiblioteca::new);
            } else {
                e = new DetalleBiblioteca();
            }

            // 1) Para el UPDATE: conserva el ID de detalle si viene
            if (det.getIdDetalleBiblioteca() != null) {
                e.setIdDetalle(det.getIdDetalleBiblioteca());
            }

            // 2) Sede
            e.setSede(det.getCodigoSede() != null
                    ? sedeRepository.findById(det.getCodigoSede())
                    .orElseThrow(() -> new RuntimeException(
                            "Sede no encontrada: " + det.getCodigoSede()))
                    : null);

            // 3) Tipo de Material
            if (det.getTipoMaterialId() != null) {
                TipoMaterial tm = tipoMaterialRepository
                        .findById(det.getTipoMaterialId())
                        .orElseThrow(() -> new RuntimeException(
                                "TipoMaterial no encontrado: " + det.getTipoMaterialId()));
                e.setTipoMaterial(tm);
            } else {
                e.setTipoMaterial(null);
            }

            // 4) Tipo de Adquisición
            if (det.getTipoAdquisicionId() != null) {
                TipoAdquisicion ta = tipoAdquisicionRepository
                        .findById(det.getTipoAdquisicionId())
                        .orElse(null);
                e.setTipoAdquisicion(ta);
            } else {
                e.setTipoAdquisicion(null);
            }

            // 5) Resto de campos
            e.setCosto(det.getCosto());
            e.setNumeroFactura(det.getNumeroFactura());
            e.setFechaIngreso(det.getFechaIngreso());
            if (det.getCodigoBarra() != null && !det.getCodigoBarra().isBlank()) {
                e.setCodigoBarra(det.getCodigoBarra());
            }
            e.setNumeroIngreso(det.getNumeroIngreso());
            e.setCodigoPrograma(det.getCodigoPrograma());
            e.setCodigoEspecialidad(det.getCodigoEspecialidad());
            e.setCodigoCiclo(det.getCodigoCiclo());
            e.setNroExistencia(det.getNroExistencia());
            e.setHoraInicio(det.getHoraInicio());
            e.setHoraFin(det.getHoraFin());
            e.setMaxHoras(det.getMaxHoras());
            e.setIdEstado(det.getIdEstado());
            e.setCantidadPrestamos(det.getCantidadPrestamos() != null ? det.getCantidadPrestamos() : 0);

            // 6) Vínculo bidireccional
            e.setBiblioteca(b);

            return e;
        }).toList();

        /* IMPORTANTÍSIMO: vacía y agrega ─ evita duplicados */
        b.getDetalles().clear();
        b.getDetalles().addAll(lista);
        return b;

    }

    /*** Si quieres devolver DTOs desde el servicio, mapea también Entidad → DTO ***/
    @Override
    public BibliotecaDTO mapToDto(Biblioteca b) {
        BibliotecaDTO dto = mapper.toDto(b);
        // El mapper no asigna el ID ni los detalles, lo hacemos aquí
        dto.setId(b.getId());
        List<DetalleBibliotecaDTO> detallesDto = b.getDetalles().stream()
                .map(mapper::toDetalleDto)
                .toList();
        dto.setDetalles(detallesDto);
        return dto;
    }
    @Override
    public void delete(Long id) {
        bibliotecaRepository.deleteById(id);
    }

    @Override
    public void deleteAll(List<Long> ids) {
        List<Biblioteca> registros = bibliotecaRepository.findAllById(ids);
        bibliotecaRepository.deleteAllInBatch(registros);
        bibliotecaRepository.flush();
    }

    @Override
    public Optional<Biblioteca> findById(Long id) {
        return bibliotecaRepository.findById(id);
    }

    @Override
    public List<Ciudad> listCiudades() {
        return ciudadRepository.findAll();
    }


    @Override
    public List<Biblioteca> listAll() {
        return bibliotecaRepository.findAll();
    }

    @Override
    public Page<BibliotecaDTO> listAllPaged(Long sedeId, Long tipoMaterialId, Pageable pageable) {
        Specification<Biblioteca> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (sedeId != null || tipoMaterialId != null) {
                Subquery<Long> sq = query.subquery(Long.class);
                var d = sq.from(DetalleBiblioteca.class);
                List<Predicate> subPreds = new ArrayList<>();
                subPreds.add(cb.equal(d.get("biblioteca").get("id"), root.get("id")));

                if (sedeId != null) {
                    subPreds.add(cb.equal(d.get("sede").get("id"), sedeId));
                }
                if (tipoMaterialId != null) {
                    subPreds.add(cb.equal(d.get("tipoMaterial").get("idTipoMaterial"), tipoMaterialId));
                }

                sq.select(cb.literal(1L)).where(subPreds.toArray(new Predicate[0]));
                predicates.add(cb.exists(sq));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return bibliotecaRepository.findAll(spec, pageable)
                .map(this::mapToDto);
    }

    @Override
    public Page<BibliotecaDTO> search(Long tipoMaterialId, String opcion, String valor,
                                      boolean soloEnProceso, Pageable pageable) {
        Specification<Biblioteca> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            if (tipoMaterialId != null) {
                preds.add(cb.equal(root.get("tipoMaterial").get("id"), tipoMaterialId));
            }

            // 2) Filtrar por 'opcion' y 'valor' con LIKE
            if (opcion != null && !opcion.isBlank() && valor != null && !valor.isBlank()) {

                String pattern = "%" + valor.toLowerCase() + "%";

                if ("editorial".equalsIgnoreCase(opcion)) {
                    preds.add(
                            cb.like(
                                    cb.lower(
                                            cb.function("TO_CHAR", String.class, root.get("editorialPublicacion"))
                                    ),
                                    pattern
                            )
                    );
                } else {
                    preds.add(
                            cb.like(
                                    cb.lower(
                                            cb.function("TO_CHAR", String.class, root.get(opcion))
                                    ),
                                    pattern
                            )
                    );
                }
            }

            if (soloEnProceso) {
                Subquery<Long> sq = query.subquery(Long.class);
                var d = sq.from(DetalleBiblioteca.class);
                sq.select(cb.literal(1L))
                        .where(
                                cb.equal(d.get("biblioteca").get("id"), root.get("id")),
                                cb.equal(d.get("idEstado"), 1L)
                        );
                preds.add(cb.exists(sq));
            } else {
                preds.add(
                        cb.or(
                                cb.notEqual(root.get("idEstado"), 1L),
                                cb.isNull(root.get("idEstado"))
                        )
                );
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };

        return bibliotecaRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    public List<DetalleBiblioteca> listDetallesByBiblioteca(Long bibliotecaId, boolean soloEnProceso) {
        List<DetalleBiblioteca> todos = detalleBibliotecaRepository.findByBibliotecaId(bibliotecaId);
        if (soloEnProceso) {
            return todos.stream()
                    .filter(d -> Objects.equals(d.getIdEstado(), 1L))
                    .toList();
        } else {
            return todos.stream()
                    .filter(d -> !Objects.equals(d.getIdEstado(), 1L))
                    .toList();
        }
    }

    public List<DetalleBibliotecaDTO> listDetallesDto(Long bibliotecaId, boolean soloEnProceso) {
        return listDetallesByBiblioteca(bibliotecaId, soloEnProceso)
                .stream()
                .map(mapper::toDetalleDto)
                .toList();
    }

    private Long generarNumeroIngreso() {
        Long max = bibliotecaRepository.findMaxNumeroDeIngreso();
        long next = (max != null ? max : 0L) + 1L;
        while (bibliotecaRepository.existsByNumeroDeIngreso(next)) {
            next++;
        }
        return next;
    }

    @Transactional
    public void cambiarEstadoDetalleYCabezera(CambioEstadoDetalleRequest req) {
        // 1) Actualiza el detalle
        DetalleBiblioteca detalle = detalleBibliotecaRepository.findById(req.getIdDetalleBiblioteca())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Detalle no encontrado: " + req.getIdDetalleBiblioteca()));
        Long estadoAnterior = detalle.getIdEstado();
        String solicitante = detalle.getCodigoUsuario();
        detalle.setIdEstado(req.getIdEstado());
        if (req.getCodigoPrograma() != null) {
            detalle.setCodigoPrograma(req.getCodigoPrograma());
        }
        if (req.getCodigoEspecialidad() != null) {
            detalle.setCodigoEspecialidad(req.getCodigoEspecialidad());
        }
        if (req.getCodigoCiclo() != null) {
            detalle.setCodigoCiclo(req.getCodigoCiclo());
        }
        if (req.getTipoPrestamo() != null) {
            detalle.setTipoPrestamo(req.getTipoPrestamo());
        }
        if (req.getIdEstado() != null && req.getIdEstado() == 3L) {
            programaMotivoAccionService.validarReservaPermitida(
                    req.getEstadoPrograma(),
                    req.getMotaccion()
            );
            // Al reservar registramos la fecha de solicitud/reserva
            detalle.setFechaSolicitud(
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            );
        }
        detalle.setUsuarioModificacion(req.getIdUsuario());
        detalle.setFechaModificacion(LocalDateTime.now());
        detalleBibliotecaRepository.save(detalle);

        if (Objects.equals(req.getIdEstado(), 4L)) {
            Integer veces = detalle.getCantidadPrestamos();
            detalle.setCantidadPrestamos(veces == null ? 1 : veces + 1);
            detalleBibliotecaRepository.save(detalle);
            if (solicitante != null) {
                notificacionService.crearNotificacion(
                        solicitante,
                        "Tu préstamo del material '" +
                                detalle.getBiblioteca().getTitulo() + "' fue aprobado."
                );
                if (Objects.equals(estadoAnterior, 3L)) {
                    emailService.sendMaterialConfirmation(detalle);
                }
            }
        } else if (Objects.equals(req.getIdEstado(), 2L)) {
            boolean canceladoPorUsuario = solicitante != null && solicitante.equals(req.getIdUsuario());
            if (solicitante != null) {
                if (canceladoPorUsuario) {
                    notificacionService.crearNotificacion(
                            solicitante,
                            "Cancelaste tu solicitud del material '" +
                                    detalle.getBiblioteca().getTitulo() + "'."
                    );
                    if (Objects.equals(estadoAnterior, 3L)) {
                        emailService.sendMaterialCancellation(detalle, solicitante);
                    }
                } else {
                    notificacionService.crearNotificacion(
                            solicitante,
                            "Tu solicitud del material '" +
                                    detalle.getBiblioteca().getTitulo() + "' fue rechazada."
                    );
                    if (Objects.equals(estadoAnterior, 3L)) {
                        emailService.sendMaterialRejection(detalle);
                    }
                }
            }
        }

        // 2) Busca si quedan otros detalles pendientes en esta misma biblioteca
        Biblioteca bib = detalle.getBiblioteca();
        boolean quedanPendientes = detalleBibliotecaRepository
                .existsByBiblioteca_IdAndIdEstado(bib.getId(), 1L);

        // 3) Si NO hay pendientes, entonces actualiza el estado de la biblioteca
        if (!quedanPendientes) {
            bib.setIdEstado(req.getIdEstado());
            bib.setUsuarioModificacion(req.getIdUsuario());
            bib.setFechaModificacion(LocalDateTime.now());
            bibliotecaRepository.save(bib);
        }
    }

    /**
     * Marca un detalle como devuelto sin registrar notificaciones.
     * También actualiza la cabecera si ya no quedan otros detalles pendientes.
     */
    @Transactional
    public void devolverDetalle(Long detalleId, String usuario) {
        DetalleBiblioteca detalle = detalleBibliotecaRepository
                .findById(detalleId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Detalle no encontrado: " + detalleId));

        detalle.setIdEstado(2L); // DISPONIBLE
        detalle.setUsuarioModificacion(usuario);
        detalle.setFechaModificacion(LocalDateTime.now());
        detalleBibliotecaRepository.save(detalle);

        Biblioteca bib = detalle.getBiblioteca();
        boolean quedanPendientes = detalleBibliotecaRepository
                .existsByBiblioteca_IdAndIdEstado(bib.getId(), 1L);

        if (!quedanPendientes) {
            bib.setIdEstado(2L);
            bib.setUsuarioModificacion(usuario);
            bib.setFechaModificacion(LocalDateTime.now());
            bibliotecaRepository.save(bib);
        }
    }

    public List<BibliotecaDTO> buscarParaCatalogo(
            String valor,
            Long sedeId,
            Long tipoMaterialId,
            String opcion
    ) {
        Specification<Biblioteca> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.notEqual(root.get("idEstado"), 1L));

            String v = valor == null ? null : valor.trim().toLowerCase();
            String opt = opcion == null ? "" : opcion.trim().toUpperCase();
            if (v != null && !v.isEmpty()) {
                String pattern = "%" + v + "%";
                if (opt.isBlank() || opt.equals("CUALQUIER CAMPO")) {
                    Join<Biblioteca, Especialidad> esp = root.join("especialidad", JoinType.LEFT);
                    preds.add(cb.or(
                            cb.like(cb.lower(root.get("titulo").as(String.class)), pattern),
                            cb.like(cb.lower(root.get("autorPersonal").as(String.class)), pattern),
                            cb.like(cb.lower(root.get("codigoLocalizacion")), pattern),
                            cb.like(cb.lower(root.get("editorialPublicacion")), pattern),
                            cb.like(cb.lower(root.get("descriptor").as(String.class)), pattern),
                            cb.like(cb.lower(root.get("notaGeneral").as(String.class)), pattern),
                            cb.like(cb.lower(esp.get("descripcion")), pattern)
                    ));
                } else {
                    switch (opt) {
                        case "TITULO":
                        case "NOMBRE":
                            preds.add(cb.like(cb.lower(root.get("titulo").as(String.class)), pattern));
                            break;
                        case "AUTOR":
                            preds.add(cb.like(cb.lower(root.get("autorPersonal").as(String.class)), pattern));
                            break;
                        case "CODIGO":
                            preds.add(cb.like(cb.lower(root.get("codigoLocalizacion")), pattern));
                            break;
                        case "EDITORIAL":
                            preds.add(cb.like(cb.lower(root.get("editorialPublicacion")), pattern));
                            break;
                        case "TEMA":
                            preds.add(cb.like(cb.lower(root.get("descriptor").as(String.class)), pattern));
                            break;
                        case "DESCRIPCION":
                            preds.add(cb.like(cb.lower(root.get("notaGeneral").as(String.class)), pattern));
                            break;
                        case "GENERO":
                            Join<Biblioteca, Especialidad> esp = root.join("especialidad", JoinType.LEFT);
                            preds.add(cb.like(cb.lower(esp.get("descripcion")), pattern));
                            break;
                    }
                }
            }


            if ((sedeId != null && sedeId != 0) || (tipoMaterialId != null && tipoMaterialId != 0)) {
                Subquery<Long> sub = query.subquery(Long.class);
                var det = sub.from(DetalleBiblioteca.class);
                sub.select(det.get("biblioteca").get("id"));

                Predicate subPred = cb.equal(det.get("biblioteca").get("id"), root.get("id"));
                if (sedeId != null && sedeId != 0) {
                    subPred = cb.and(subPred, cb.equal(det.get("sede").get("id"), sedeId));
                }
                if (tipoMaterialId != null && tipoMaterialId != 0) {
                    subPred = cb.and(subPred, cb.equal(det.get("tipoMaterial").get("idTipoMaterial"), tipoMaterialId));
                }
                sub.where(subPred);
                preds.add(cb.exists(sub));
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };

        return bibliotecaRepository
                .findAll(spec, Pageable.unpaged())
                .stream()
                .map(this::mapToDtoSinDetalles)
                .toList();
    }

    private BibliotecaDTO mapToDtoSinDetalles(Biblioteca b) {
        BibliotecaDTO dto = mapper.toDto(b);
        dto.setId(b.getId());
        dto.setDetalles(List.of());
        return dto;
    }

    public List<BibliotecaDTO> findReservados() {
        return bibliotecaRepository
                .findByIdEstado(3L)                 // busca todos los que tienen IDESTADO = 3
                .stream()
                .map(this::mapToDto)                // convierte cada entidad a su DTO
                .collect(Collectors.toList());
    }

    @Override
    public List<BibliotecaDTO> findDisponibles() {
        return bibliotecaRepository
                .findByIdEstado(2L)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BibliotecaDTO> findDisponiblesPorTipoMaterial(Long tipoMaterialId) {
        return bibliotecaRepository
                .findByIdEstado(2L)
                .stream()
                .filter(b -> {
                    if (tipoMaterialId == null) {
                        return true;
                    }
                    return detalleBibliotecaRepository
                            .findByBibliotecaId(b.getId())
                            .stream()
                            .anyMatch(det -> det.getTipoMaterial() != null
                                    && Objects.equals(
                                    det.getTipoMaterial().getIdTipoMaterial(),
                                    tipoMaterialId));
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DetalleBibliotecaDTO> listarTodosDetallesReservados() {
        List<DetalleBiblioteca> listaEntidades = detalleBibliotecaRepository.findAllConBibliotecaReservados();
        return listaEntidades.stream()
                .map(mapper::toDetalleDto)   // Aquí dentro toDetalleDto ya verá d.getBiblioteca() != null
                .collect(Collectors.toList());
    }

    @Override
    public List<EjemplarPrestadoDTO> reporteEjemplarMasPrestado(Long sede,
                                                                Long tipoMaterial,
                                                                Long especialidad,
                                                                Integer ciclo,
                                                                Long numeroIngreso,
                                                                java.time.LocalDate fechaInicio,
                                                                java.time.LocalDate fechaFin) {
        return ocurrenciaBibliotecaRepository.reporteEjemplarMasPrestado(
                sede,
                tipoMaterial,
                especialidad,
                ciclo,
                numeroIngreso,
                fechaInicio,
                fechaFin);
    }

    @Override
    public List<EjemplarNoPrestadoDTO> reporteEjemplarNoPrestado(Long sede,
                                                                 Long tipoMaterial,
                                                                 Long especialidad,
                                                                 Integer ciclo,
                                                                 Long numeroIngreso,
                                                                 java.time.LocalDate fechaInicio,
                                                                 java.time.LocalDate fechaFin) {
        return ocurrenciaBibliotecaRepository.reporteEjemplarNoPrestado(
                sede,
                tipoMaterial,
                especialidad,
                ciclo,
                numeroIngreso,
                fechaInicio,
                fechaFin);
    }
}
