package com.miapp.service;

import com.miapp.model.OcurrenciaMaterial;
import com.miapp.model.OcurrenciaUsuario;
import com.miapp.model.dto.MaterialCostDTO;
import com.miapp.model.dto.OcurrenciaBibliotecaDTO;
import com.miapp.model.dto.OcurrenciaMaterialDTO;
import com.miapp.model.dto.OcurrenciaUsuarioDTO;

import java.util.List;

public interface OcurrenciaBibliotecaService {
    OcurrenciaBibliotecaDTO crear(OcurrenciaBibliotecaDTO dto);
    List<OcurrenciaBibliotecaDTO> listarTodas();
    List<OcurrenciaBibliotecaDTO> listarMateriales();
    List<OcurrenciaBibliotecaDTO> listarEquipos();
    OcurrenciaBibliotecaDTO buscarPorId(Long id);
    /** Obtiene el siguiente ID para una nueva ocurrencia */
    Long obtenerSiguienteId();
    OcurrenciaUsuario saveUsuario(Long idOcurrencia, String codigoUsuario, Integer tipoUsuario);
    OcurrenciaMaterial saveMaterial(Long idOcurrencia, Long idEquipo, Integer cantidad, Boolean esBiblioteca);

    List<OcurrenciaUsuarioDTO> listarUsuariosDeOcurrencia(Long idOcurrencia);

    List<OcurrenciaMaterialDTO> listarMaterialesDeOcurrencia(Long idOcurrencia);
    void costearMateriales(Long idOcurrencia, List<MaterialCostDTO> costos);
    /** Devuelve las ocurrencias registradas para el usuario indicado */
    List<OcurrenciaBibliotecaDTO> listarPorUsuario(String codigoUsuario);

    /** Lista ocurrencias que ya cuentan con costo registrado */
    List<OcurrenciaBibliotecaDTO> listarCosteadas();

    /** Actualiza el estado de regularización de una ocurrencia */
    OcurrenciaBibliotecaDTO actualizarRegulariza(Long id, Integer regulariza);
}