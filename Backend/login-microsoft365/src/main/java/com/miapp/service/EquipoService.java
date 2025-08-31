package com.miapp.service;

import com.miapp.model.Equipo;
import com.miapp.model.Estado;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.EstadoRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final EstadoRepository estadoRepository;

    public EquipoService(EquipoRepository equipoRepository, EstadoRepository estadoRepository) {
        this.equipoRepository = equipoRepository;
        this.estadoRepository = estadoRepository;
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

    // Listado completo
    public List<Equipo> listarEquipos() {
        return equipoRepository.findAll();
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

    public List<Equipo> filtrarPorSedeExcluyendoEnProceso(Long idSede) {
        return equipoRepository.findBySede_IdAndEstado_DescripcionNotIgnoreCase(idSede, "EN PROCESO");
    }

    // Lista solo los equipos cuyo estado sea "EN PROCESO"
    public List<Equipo> listEnProceso() {
        return equipoRepository.findByEstado_DescripcionIgnoreCase("EN PROCESO");
    }

    // Lista los equipos cuyo estado NO sea "EN PROCESO"
    public List<Equipo> listWithoutEnProceso() {
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
}
