package com.miapp.service;

import com.miapp.model.Equipo;
import com.miapp.model.Estado;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.EstadoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final EstadoRepository estadoRepository;
    private final JdbcTemplate jdbcTemplate;
    private final String validarBloqueoCall;
    private final String inactivarEquipoCall;

    public EquipoService(EquipoRepository equipoRepository,
                         EstadoRepository estadoRepository,
                         JdbcTemplate jdbcTemplate,
                         @Value("${app.procedures.schema:}") String procedureSchema) {
        this.equipoRepository = equipoRepository;
        this.estadoRepository = estadoRepository;
        this.jdbcTemplate = jdbcTemplate;
        String schema = procedureSchema == null ? "" : procedureSchema.trim();
        this.validarBloqueoCall = buildCall(schema, "usp_DetallePrestamoEquipo_Validar", 2);
        this.inactivarEquipoCall = buildCall(schema, "usp_DetallePrestamoEquipo_InactivarEquipo", 2);
    }

    private String buildCall(String schema, String procedure, int parameterCount) {
        String qualifiedName = schema.isEmpty() ? procedure : schema + "." + procedure;
        StringBuilder placeholders = new StringBuilder();
        for (int i = 0; i < parameterCount; i++) {
            if (i > 0) {
                placeholders.append(", ");
            }
            placeholders.append("?");
        }
        return "{call " + qualifiedName + "(" + placeholders + ")}";
    }

    // Registro
    public Equipo crearEquipo(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    // Actualización
    @Transactional
    public Equipo actualizarEquipo(Long id, Equipo equipo) {
        Optional<Equipo> equipoOpt = equipoRepository.findById(id);
        if (equipoOpt.isPresent()) {
            Equipo equipoExistente = equipoOpt.get();
            equipoExistente.setNombreEquipo(equipo.getNombreEquipo());
            equipoExistente.setNumeroEquipo(equipo.getNumeroEquipo());
            equipoExistente.setIp(equipo.getIp());
            equipoExistente.setEquipoDiscapacidad(equipo.getEquipoDiscapacidad());
            equipoExistente.setSede(equipo.getSede());
            equipoExistente.setEstado(equipo.getEstado());
            equipoExistente.setHoraInicio(equipo.getHoraInicio());
            equipoExistente.setHoraFin(equipo.getHoraFin());
            equipoExistente.setMaxHoras(equipo.getMaxHoras());
            return equipoRepository.save(equipoExistente);
        }
        throw new RuntimeException("Equipo no encontrado con id: " + id);
    }

    // Eliminación
    public void eliminarEquipo(Long id) {
        equipoRepository.deleteById(id);
    }

    // Listado completo excluyendo equipos "EN PROCESO" con opción a filtrar por discapacidad
    public List<Equipo> listarEquipos(Boolean discapacidad) {
        return listWithoutEnProceso(discapacidad);
    }

    // Filtrado por sede
    public List<Equipo> filtrarPorSede(Long idSede) {
        return equipoRepository.findBySede_Id(idSede);
    }

    // Cambio de estado
    public Equipo cambiarEstado(Long idEquipo, String nuevaDescripcionEstado) {
        Equipo equipo = equipoRepository.findById(idEquipo)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con id: " + idEquipo));

        // Busca el estado por la descripción (sin distinguir mayúsculas/minúsculas)
        Estado nuevoEstado = estadoRepository.findByDescripcionIgnoreCase(nuevaDescripcionEstado)
                .orElseThrow(() -> new RuntimeException("Estado no encontrado con descripción: " + nuevaDescripcionEstado));

        equipo.setEstado(nuevoEstado);
        return equipoRepository.save(equipo);
    }

    // Obtener por id
    public Optional<Equipo> obtenerEquipo(Long id) {
        return equipoRepository.findById(id);
    }

    public List<Equipo> filtrarPorSedeExcluyendoEnProceso(Long idSede, Boolean discapacidad) {
        if (Boolean.TRUE.equals(discapacidad)) {
            return equipoRepository.findBySede_IdAndEstado_DescripcionNotIgnoreCaseAndEquipoDiscapacidad(idSede, "EN PROCESO", true);
        }
        if (Boolean.FALSE.equals(discapacidad)) {
            return equipoRepository.findBySedeIdAndEstadoDescripcionNotIgnoreCaseAndEquipoDiscapacidadFalseOrNull(idSede, "EN PROCESO");
        }
        return equipoRepository.findBySede_IdAndEstado_DescripcionNotIgnoreCase(idSede, "EN PROCESO");
    }

    // Lista solo los equipos cuyo estado sea "EN PROCESO"
    public List<Equipo> listEnProceso() {
        return equipoRepository.findByEstado_DescripcionIgnoreCase("EN PROCESO");
    }

    // Lista los equipos cuyo estado NO sea "EN PROCESO", con opción a filtrar por discapacidad
    public List<Equipo> listWithoutEnProceso(Boolean discapacidad) {
        if (Boolean.TRUE.equals(discapacidad)) {
            return equipoRepository.findByEstado_DescripcionNotIgnoreCaseAndEquipoDiscapacidad("EN PROCESO", true);
        }
        if (Boolean.FALSE.equals(discapacidad)) {
            return equipoRepository.findByEstadoDescripcionNotIgnoreCaseAndEquipoDiscapacidadFalseOrNull("EN PROCESO");
        }
        return equipoRepository.findByEstado_DescripcionNotIgnoreCase("EN PROCESO");
    }

    // Método que retorna equipos que tengan el estado "EN PROCESO"
    public List<Equipo> filtrarSoloEnProceso(Long idSede) {
        return equipoRepository.findBySede_IdAndEstado_DescripcionIgnoreCase(idSede, "EN PROCESO");
    }

    public List<Equipo> listar(String q) {
        if (q == null || q.isBlank()) {
            return equipoRepository.findAll();
        }
        return equipoRepository.search(q);
    }

    public void eliminarEquipos(List<Long> ids) {
        List<Equipo> registros = equipoRepository.findAllById(ids);
        equipoRepository.deleteAllInBatch(registros);
        equipoRepository.flush();
    }
    public boolean existeIp(String ip, Long id) {
        if (id != null) {
            return equipoRepository.existsByIpAndIdEquipoNot(ip, id);
        }
        return equipoRepository.existsByIp(ip);
    }
    public int validarBloqueo(String numeroIp) {
        try {
            Integer resultado = jdbcTemplate.execute(
                    (Connection con) -> {
                        CallableStatement cs = con.prepareCall(validarBloqueoCall);
                        cs.setString(1, numeroIp);
                        cs.registerOutParameter(2, Types.NUMERIC);
                        return cs;
                    },
                    (CallableStatement cs) -> {
                        cs.execute();
                        Integer valor = cs.getObject(2, Integer.class);
                        return valor != null ? valor : 2;
                    }
            );
            return resultado != null ? resultado : 2;
        } catch (DataAccessException ex) {
            throw new RuntimeException("Error al validar el estado del equipo con IP: " + numeroIp, ex);
        }
    }

    public boolean inactivarEquipoPorIp(String numeroIp) {
        try {
            Integer actualizados = jdbcTemplate.execute(
                    (Connection con) -> {
                        CallableStatement cs = con.prepareCall(inactivarEquipoCall);
                        cs.setString(1, numeroIp);
                        cs.registerOutParameter(2, Types.NUMERIC);
                        return cs;
                    },
                    (CallableStatement cs) -> {
                        cs.execute();
                        return cs.getInt(2);
                    }
            );
            return actualizados != null && actualizados > 0;
        } catch (DataAccessException ex) {
            throw new RuntimeException("Error al inactivar el equipo con IP: " + numeroIp, ex);
        }
    }
}