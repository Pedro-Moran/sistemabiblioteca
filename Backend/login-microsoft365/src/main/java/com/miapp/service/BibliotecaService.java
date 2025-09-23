package com.miapp.service;

import com.miapp.model.Ciudad;
import com.miapp.model.dto.*;
import com.miapp.model.Biblioteca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface BibliotecaService {
    Biblioteca register(BibliotecaDTO dto, MultipartFile portada);
    Biblioteca update(Long id, BibliotecaDTO dto, MultipartFile portada);
    void delete(Long id);
    void deleteAll(List<Long> ids);
    Optional<Biblioteca> findById(Long id);
    List<Biblioteca> listAll();
    Page<BibliotecaDTO> listAllPaged(Long sedeId, Long tipoMaterialId, Pageable pageable);
    BibliotecaDTO mapToDto(Biblioteca b);
    List<Ciudad> listCiudades();
    Page<BibliotecaDTO> search(Long tipoMaterialId, String opcion, String valor,
                               boolean soloEnProceso, Pageable pageable);
    List<BibliotecaDTO> findReservados();
    /** Lista todos los materiales bibliográficos con estado disponible (2) */
    List<BibliotecaDTO> findDisponibles();

    /** Lista disponibles filtrando por tipo de material */
    List<BibliotecaDTO> findDisponiblesPorTipoMaterial(Long tipoMaterialId);

    List<DetalleBibliotecaDTO> listarTodosDetallesReservados();

    /** Reporte de ejemplares más prestados */
    List<EjemplarPrestadoDTO> reporteEjemplarMasPrestado(Long sede,
                                                         Long tipoMaterial,
                                                         Long especialidad,
                                                         Integer ciclo,
                                                         Long numeroIngreso,
                                                         java.time.LocalDate fechaInicio,
                                                         java.time.LocalDate fechaFin);

    /** Reporte de ejemplares que nunca fueron prestados */
    List<EjemplarNoPrestadoDTO> reporteEjemplarNoPrestado(Long sede,
                                                          Long tipoMaterial,
                                                          Long especialidad,
                                                          Integer ciclo,
                                                          Long numeroIngreso,
                                                          java.time.LocalDate fechaInicio,
                                                          java.time.LocalDate fechaFin);
}
