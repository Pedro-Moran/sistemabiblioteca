package com.miapp.service.impl;

import com.miapp.model.*;
import com.miapp.model.dto.MaterialCostDTO;
import com.miapp.model.dto.OcurrenciaBibliotecaDTO;
import com.miapp.model.dto.OcurrenciaMaterialDTO;
import com.miapp.model.dto.OcurrenciaUsuarioDTO;
import com.miapp.repository.*;
import com.miapp.service.EmailService;
import com.miapp.service.NotificacionService;
import com.miapp.service.OcurrenciaBibliotecaService;
import com.miapp.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OcurrenciaBibliotecaServiceImpl implements OcurrenciaBibliotecaService {

    private final OcurrenciaBibliotecaRepository repo;
    private final DetallePrestamoRepository detallePrestamoRepo;
    private final DetalleBibliotecaRepository detalleBiblioRepo;
    private final SedeRepository sedeRepo;
    private final OcurrenciaUsuarioRepository repoU;
    private final OcurrenciaMaterialRepository repoM;
    private final EquipoRepository equipoRepo;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final NotificacionService notificacionService;

    @Override
    public OcurrenciaBibliotecaDTO crear(OcurrenciaBibliotecaDTO dto) {
        OcurrenciaBiblioteca ent = new OcurrenciaBiblioteca();
        if (dto.getIdDetallePrestamo() != null) {
            ent.setDetallePrestamo(
                    detallePrestamoRepo.findById(dto.getIdDetallePrestamo()).orElseThrow());
        }

        if (dto.getIdDetalleBiblioteca() != null) {
            ent.setDetalleBiblioteca(
                    detalleBiblioRepo.findById(dto.getIdDetalleBiblioteca()).orElse(null));
        }

        if (dto.getSedePrestamo()!=null) {
            ent.setSedePrestamo(
                    sedeRepo.findById(dto.getSedePrestamo()).orElse(null));
        }
        ent.setCodigoLocalizacion(dto.getCodigoLocalizacion());
        ent.setCodigoUsuario(dto.getCodigoUsuario());
        ent.setCosto(dto.getCosto());
        ent.setDescripcion(dto.getDescripcion());
        ent.setDescripcionRegulariza(dto.getDescripcionRegulariza());
        ent.setEstadoCosto(dto.getEstadoCosto());
        ent.setFechaCosto(dto.getFechaCosto());
        ent.setFechaCreacion(LocalDateTime.now());
        ent.setFechaOcurrencia(dto.getFechaOcurrencia());
        ent.setFechaPrestamo(dto.getFechaPrestamo());
        ent.setIdPrestamo(dto.getIdPrestamo());
        ent.setMontoPagado(dto.getMontoPagado());
        ent.setNroIngreso(dto.getNroIngreso());
        ent.setNumeroPago(dto.getNumeroPago());
        ent.setPacPro(dto.getPacPro());
        ent.setRegulariza(dto.getRegulariza());
        ent.setUsuarioCosto(dto.getUsuarioCosto());
        ent.setUsuarioCreacion(dto.getUsuarioCreacion());
        ent.setUsuarioModificacion(dto.getUsuarioModificacion());
        ent.setUsuarioPrestamo(dto.getUsuarioPrestamo());
        ent.setUsuarioSedEc(dto.getUsuarioSedEc());
        ent.setUsuarioSedEm(dto.getUsuarioSedEm());
        ent.setAbono(dto.getAbono());
        ent.setAnulado(dto.getAnulado());

        OcurrenciaBiblioteca saved = repo.save(ent);
        dto.setId(saved.getId());
        dto.setFechaCreacion(saved.getFechaCreacion());
        return dto;
    }

    @Override
    public List<OcurrenciaBibliotecaDTO> listarTodas() {
        return repo.findAllByOrderByIdDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OcurrenciaBibliotecaDTO> listarMateriales() {
        return repo.findAllByOrderByIdDesc()
                .stream()
                .filter(o -> o.getDetalleBiblioteca() != null
                        || repoM.existsByIdocurrenciaAndEsBibliotecaTrue(o.getId()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OcurrenciaBibliotecaDTO> listarEquipos() {
        return repo.findAllByOrderByIdDesc()
                .stream()
                .filter(o -> o.getDetallePrestamo() != null
                        || repoM.existsByIdocurrenciaAndEsBibliotecaFalse(o.getId()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OcurrenciaBibliotecaDTO> listarPorUsuario(String codigoUsuario) {
        return repo.findByCodigoUsuarioIgnoreCase(codigoUsuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OcurrenciaBibliotecaDTO buscarPorId(Long id) {
        return repo.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    public Long obtenerSiguienteId() {
        Long max = repo.findMaxId();
        return (max != null ? max : 0L) + 1L;
    }

    private OcurrenciaBibliotecaDTO toDTO(OcurrenciaBiblioteca e) {
        OcurrenciaBibliotecaDTO dto = new OcurrenciaBibliotecaDTO();
        dto.setId(e.getId());
        if (e.getDetallePrestamo() != null) {
            dto.setIdDetallePrestamo(e.getDetallePrestamo().getId());
            Equipo eq = e.getDetallePrestamo().getEquipo();
            if (eq != null) {
                dto.setIdEquipo(eq.getIdEquipo());
                dto.setEquipoNombre(eq.getNombreEquipo());
                dto.setEquipoNumero(eq.getNumeroEquipo());
                dto.setEquipoIp(eq.getIp());
            }
        } else {
            // La ocurrencia puede haberse creado manualmente. Si existe un
            // material de laboratorio asociado, usamos sus datos para
            // poblar la información básica del equipo en el DTO.
            repoM.findByIdocurrencia(e.getId()).stream()
                    .filter(m -> m.getEsBiblioteca() == null || !m.getEsBiblioteca())
                    .findFirst()
                    .ifPresent(m -> {
                        dto.setIdEquipo(m.getIdEquipoLaboratorio());
                        equipoRepo.findById(m.getIdEquipoLaboratorio())
                                .ifPresent(eqLab -> {
                                    dto.setEquipoNombre(eqLab.getNombreEquipo());
                                    dto.setEquipoNumero(eqLab.getNumeroEquipo());
                                    dto.setEquipoIp(eqLab.getIp());
                                });
                    });
        }
        if (e.getDetalleBiblioteca()!=null) {
            Long idDetalle = e.getDetalleBiblioteca().getIdDetalle();
            DetalleBiblioteca det = detalleBiblioRepo.findById(idDetalle).orElse(null);
            if (det != null) {
                dto.setIdDetalleBiblioteca(det.getIdDetalle());
                dto.setIdEjemplar(
                        det.getNumeroIngreso()!=null
                                ? det.getNumeroIngreso().toString()
                                : String.valueOf(det.getIdDetalle())
                );
                dto.setEjemplar(det.getBiblioteca()!=null ? det.getBiblioteca().getTitulo() : null);
                dto.setSede(det.getSede()!=null ? det.getSede().getDescripcion() : null);
                dto.setTipoMaterial(det.getTipoMaterial()!=null ? det.getTipoMaterial().getDescripcion() : null);
            }
        }
        dto.setCodigoLocalizacion(e.getCodigoLocalizacion());
        dto.setCodigoUsuario(e.getCodigoUsuario());
        dto.setCosto(repoM.sumCostoByOcurrencia(e.getId()));
        dto.setDescripcion(e.getDescripcion());
        dto.setDescripcionRegulariza(e.getDescripcionRegulariza());
        dto.setEstadoCosto(e.getEstadoCosto());
        dto.setFechaCosto(e.getFechaCosto());
        dto.setFechaCreacion(e.getFechaCreacion());
        dto.setFechaModificacion(e.getFechaModificacion());
        dto.setFechaOcurrencia(e.getFechaOcurrencia());
        dto.setFechaPrestamo(e.getFechaPrestamo());
        dto.setIdPrestamo(e.getIdPrestamo());
        dto.setMontoPagado(e.getMontoPagado());
        dto.setNroIngreso(e.getNroIngreso());
        dto.setNumeroPago(e.getNumeroPago());
        dto.setPacPro(e.getPacPro());
        dto.setRegulariza(e.getRegulariza());
        dto.setUsuarioCosto(e.getUsuarioCosto());
        dto.setUsuarioCreacion(e.getUsuarioCreacion());
        dto.setUsuarioModificacion(e.getUsuarioModificacion());
        dto.setUsuarioPrestamo(e.getUsuarioPrestamo());
        if (e.getSedePrestamo()!=null)
            dto.setSedePrestamo(e.getSedePrestamo().getId());
        if (e.getSedePrestamo()!=null)
            dto.setSedeDescripcion(e.getSedePrestamo().getDescripcion());
        dto.setUsuarioSedEc(e.getUsuarioSedEc());
        dto.setUsuarioSedEm(e.getUsuarioSedEm());
        dto.setAbono(e.getAbono());
        dto.setAnulado(e.getAnulado());
        dto.setEsBiblioteca(e.getDetalleBiblioteca() != null);
        return dto;
    }

    public OcurrenciaUsuario saveUsuario(Long idOcurrencia, String codigoUsuario, Integer tipo) {
        OcurrenciaUsuario u = new OcurrenciaUsuario();
        u.setIdocurrencia(idOcurrencia);
        u.setCodigoUsuario(codigoUsuario);
        u.setTipoUsuario(tipo);
        OcurrenciaUsuario saved = repoU.save(u);

        // si la ocurrencia no tenía código de usuario principal, lo actualizamos
        OcurrenciaBiblioteca oc = repo.findById(idOcurrencia).orElse(null);
        if (oc != null && (oc.getCodigoUsuario() == null || oc.getCodigoUsuario().isBlank())) {
            oc.setCodigoUsuario(codigoUsuario);
            repo.save(oc);
        }

        return saved;
    }
    public OcurrenciaMaterial saveMaterial(Long idOcurrencia, Long idEquipo, Integer cantidad, Boolean esBiblioteca) {
        OcurrenciaMaterial m = new OcurrenciaMaterial();
        m.setIdocurrencia(idOcurrencia);
        m.setIdEquipoLaboratorio(idEquipo);
        m.setCantidad(cantidad);
        m.setEsBiblioteca(esBiblioteca != null ? esBiblioteca : Boolean.FALSE);
        return repoM.save(m);
    }

    @Override
    public List<OcurrenciaUsuarioDTO> listarUsuariosDeOcurrencia(Long idOcurrencia) {
        OcurrenciaBiblioteca oc = repo.findById(idOcurrencia).orElseThrow();
        DetallePrestamo dp = oc.getDetallePrestamo();
        List<OcurrenciaUsuarioDTO> lista = new ArrayList<>();

        if (dp != null) {
            Usuario u = usuarioRepository.findByLoginIgnoreCase(dp.getCodigoUsuario()).orElse(null);
            lista.add(new OcurrenciaUsuarioDTO(
                    null,
                    dp.getCodigoUsuario(),
                    dp.getTipoUsuario(),
                    u != null ? u.getIdUsuario() : null,
                    u != null ? u.getNombreUsuario() : null,
                    u != null ? u.getApellidoPaterno() : null,
                    u != null ? u.getApellidoMaterno() : null
            ));
        }

        repoU.findByIdocurrencia(idOcurrencia).forEach(u -> {
            Usuario usr = usuarioRepository.findByLoginIgnoreCase(u.getCodigoUsuario()).orElse(null);
            lista.add(new OcurrenciaUsuarioDTO(
                    u.getId(),
                    u.getCodigoUsuario(),
                    u.getTipoUsuario(),
                    usr != null ? usr.getIdUsuario() : null,
                    usr != null ? usr.getNombreUsuario() : null,
                    usr != null ? usr.getApellidoPaterno() : null,
                    usr != null ? usr.getApellidoMaterno() : null
            ));
        });

        return lista;
    }
    @Override
    @Transactional
    public List<OcurrenciaMaterialDTO> listarMaterialesDeOcurrencia(Long idOcurrencia) {
        // 1) Obtenemos la ocurrencia y el detalle de préstamo asociado
        OcurrenciaBiblioteca oc = repo.findById(idOcurrencia)
                .orElseThrow(() -> new EntityNotFoundException("Ocurrencia " + idOcurrencia + " no encontrada"));
        DetallePrestamo dp = oc.getDetallePrestamo();

        List<OcurrenciaMaterialDTO> lista = new ArrayList<>();

        if (dp != null) {
            // 2) Buscamos si ya existe un registro en OCURRENCIA_MATERIAL para el equipo original
            Long idEquipoOriginal = dp.getEquipo().getIdEquipo();
            OcurrenciaMaterial originalEnTabla = repoM
                    .findByIdocurrenciaAndIdEquipoLaboratorio(idOcurrencia, idEquipoOriginal)
                    .orElse(null);

            if (originalEnTabla == null) {
                // Si no existía aún, lo creamos con cantidad = 1 y sin costo
                OcurrenciaMaterial mNuevo = new OcurrenciaMaterial();
                mNuevo.setIdocurrencia(idOcurrencia);
                mNuevo.setIdEquipoLaboratorio(idEquipoOriginal);
                mNuevo.setCantidad(1);
                mNuevo.setEsBiblioteca(false);
                // no seteamos costoUnitario, queda null
                originalEnTabla = repoM.save(mNuevo);
            }

            // 3) Capturamos el ID de 'originalEnTabla' en una variable final para usarla dentro de la lambda
            final Long idOriginal = originalEnTabla.getId();

            // 4) Preparamos la lista de DTOs e incluimos primero el “material original”
            lista.add(new OcurrenciaMaterialDTO(
                    idOriginal,
                    idEquipoOriginal.toString(),
                    dp.getEquipo().getNombreEquipo(),
                    originalEnTabla.getCantidad(),
                    originalEnTabla.getCostoUnitario(),
                    false
            ));

            // 5) Luego añadimos el resto de materiales asociados a la ocurrencia,
            //    excluyendo el que ya acabamos de insertar/obtener (con id == idOriginal)
            repoM.findByIdocurrencia(idOcurrencia).forEach(m -> {
                if (!m.getId().equals(idOriginal)) {
                    Equipo e = equipoRepo.findById(m.getIdEquipoLaboratorio())
                            .orElse(null);
                    String nombreEquipo = (e != null) ? e.getNombreEquipo() : "<sin nombre>";
                    lista.add(new OcurrenciaMaterialDTO(
                            m.getId(),
                            m.getIdEquipoLaboratorio().toString(),
                            nombreEquipo,
                            m.getCantidad(),
                            m.getCostoUnitario(),
                            m.getEsBiblioteca() != null && m.getEsBiblioteca()
                    ));
                }
            });
        } else if (oc.getDetalleBiblioteca() != null) {
            // Ocurrencia asociada a material bibliográfico
            DetalleBiblioteca db = oc.getDetalleBiblioteca();
            Long idRef = db.getNumeroIngreso() != null ? db.getNumeroIngreso() : db.getIdDetalle();

            OcurrenciaMaterial originalEnTabla = repoM
                    .findByIdocurrenciaAndIdEquipoLaboratorio(idOcurrencia, idRef)
                    .orElse(null);

            if (originalEnTabla == null) {
                OcurrenciaMaterial nuevo = new OcurrenciaMaterial();
                nuevo.setIdocurrencia(idOcurrencia);
                nuevo.setIdEquipoLaboratorio(idRef);
                nuevo.setCantidad(1);
                nuevo.setEsBiblioteca(true);
                originalEnTabla = repoM.save(nuevo);
            }

            final Long idOriginal = originalEnTabla.getId();
            String nombre = (db.getBiblioteca() != null)
                    ? db.getBiblioteca().getTitulo()
                    : (db.getTipoMaterial() != null ? db.getTipoMaterial().getDescripcion() : "<sin nombre>");

            lista.add(new OcurrenciaMaterialDTO(
                    idOriginal,
                    idRef.toString(),
                    nombre,
                    originalEnTabla.getCantidad(),
                    originalEnTabla.getCostoUnitario(),
                    true
            ));

            repoM.findByIdocurrencia(idOcurrencia).forEach(m -> {
                if (!m.getId().equals(idOriginal)) {
                    Equipo e = equipoRepo.findById(m.getIdEquipoLaboratorio()).orElse(null);
                    String nombreEquipo = (e != null) ? e.getNombreEquipo() : "<sin nombre>";
                    lista.add(new OcurrenciaMaterialDTO(
                            m.getId(),
                            m.getIdEquipoLaboratorio().toString(),
                            nombreEquipo,
                            m.getCantidad(),
                            m.getCostoUnitario(),
                            m.getEsBiblioteca() != null && m.getEsBiblioteca()
                    ));
                }
            });
        } else {
            // Si la ocurrencia no está ligada a un préstamo de equipo, solo listamos los materiales registrados
            repoM.findByIdocurrencia(idOcurrencia).forEach(m -> {
                String nombreItem;
                if (m.getEsBiblioteca() != null && m.getEsBiblioteca()) {
                    DetalleBiblioteca d = detalleBiblioRepo.findById(m.getIdEquipoLaboratorio()).orElse(null);
                    nombreItem = d != null && d.getBiblioteca()!=null
                            ? d.getBiblioteca().getTitulo()
                            : "<sin nombre>";
                } else {
                    Equipo e = equipoRepo.findById(m.getIdEquipoLaboratorio()).orElse(null);
                    nombreItem = e != null ? e.getNombreEquipo() : "<sin nombre>";
                }
                lista.add(new OcurrenciaMaterialDTO(
                        m.getId(),
                        m.getIdEquipoLaboratorio().toString(),
                        nombreItem,
                        m.getCantidad(),
                        m.getCostoUnitario(),
                        m.getEsBiblioteca() != null && m.getEsBiblioteca()
                ));

        });
}
        return lista;
    }

    @Override
    @Transactional
    public void costearMateriales(Long idOcurrencia, List<MaterialCostDTO> costos) {
        // Para cada DTO, busca la entidad OcurrenciaMaterial y actualiza el campo costoUnitario
        costos.forEach(dto -> {
            if (dto.idMaterial() == null) {
                throw new IllegalArgumentException("idMaterial no puede ser null");
            }
            OcurrenciaMaterial m = repoM.findById(dto.idMaterial())
                    .orElseThrow(() -> new EntityNotFoundException("Material " + dto.idMaterial() + " no encontrado"));
            m.setCostoUnitario(dto.costoUnitario());
            repoM.save(m);
        });

        OcurrenciaBiblioteca oc = repo.findById(idOcurrencia)
                .orElseThrow(() -> new EntityNotFoundException("Ocurrencia " + idOcurrencia + " no encontrada"));
        oc.setEstadoCosto(1);
        oc.setFechaCosto(LocalDateTime.now());
        repo.save(oc);

        List<OcurrenciaUsuario> usuarios = repoU.findByIdocurrencia(idOcurrencia);
        for (OcurrenciaUsuario u : usuarios) {
            String login = u.getCodigoUsuario();
            usuarioRepository.findByLogin(login).ifPresent(user ->
                    emailService.sendOcurrenciaCosteada(user.getEmail(), idOcurrencia));
            notificacionService.crearNotificacion(login,
                    "Ocurrencia " + idOcurrencia + " costeada");
        }
    }

    @Override
    public List<OcurrenciaBibliotecaDTO> listarCosteadas() {
        return repo.findByEstadoCostoOrderByIdDesc(1)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OcurrenciaBibliotecaDTO actualizarRegulariza(Long id, Integer regulariza) {
        OcurrenciaBiblioteca oc = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ocurrencia " + id + " no encontrada"));
        oc.setRegulariza(regulariza);
        oc.setFechaModificacion(LocalDateTime.now());
        repo.save(oc);
        return toDTO(oc);
    }
}
