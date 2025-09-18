package com.miapp.service;

import com.miapp.mapper.BibliotecaMapper;
import com.miapp.model.dto.VisitanteBibliotecaVirtualDTO;
import com.miapp.repository.DetalleBibliotecaRepository;
import com.miapp.repository.DetallePrestamoRepository;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.EstadoRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.repository.UsuarioRepository;
import com.miapp.repository.VisitaBibliotecaVirtualRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.scheduling.TaskScheduler;

import java.time.LocalDateTime;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PrestamoServiceReporteVisitantesTest {

    private PrestamoService prestamoService;
    private JdbcTemplate jdbcTemplate;
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @BeforeEach
    void setUp() {
        EquipoRepository equipoRepository = mock(EquipoRepository.class);
        DetallePrestamoRepository detallePrestamoRepository = mock(DetallePrestamoRepository.class);
        EstadoRepository estadoRepository = mock(EstadoRepository.class);
        NotificacionService notificacionService = mock(NotificacionService.class);
        SedeService sedeService = mock(SedeService.class);
        EmailService emailService = mock(EmailService.class);
        TaskScheduler scheduler = mock(TaskScheduler.class);
        OcurrenciaBibliotecaRepository ocurrenciaBibliotecaRepository = mock(OcurrenciaBibliotecaRepository.class);
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        DetalleBibliotecaRepository detalleBibliotecaRepository = mock(DetalleBibliotecaRepository.class);
        VisitaBibliotecaVirtualRepository visitaBibliotecaVirtualRepository = mock(VisitaBibliotecaVirtualRepository.class);
        BibliotecaMapper bibliotecaMapper = mock(BibliotecaMapper.class);
        jdbcTemplate = mock(JdbcTemplate.class);
        namedParameterJdbcTemplate = mock(NamedParameterJdbcTemplate.class);

        prestamoService = new PrestamoService(
                equipoRepository,
                detallePrestamoRepository,
                estadoRepository,
                notificacionService,
                sedeService,
                emailService,
                scheduler,
                ocurrenciaBibliotecaRepository,
                usuarioRepository,
                detalleBibliotecaRepository,
                visitaBibliotecaVirtualRepository,
                bibliotecaMapper,
                jdbcTemplate,
                namedParameterJdbcTemplate
        );

        when(namedParameterJdbcTemplate.query(anyString(), any(SqlParameterSource.class), any(RowMapper.class)))
                .thenReturn(Collections.emptyList());
    }

    @Test
    void reporteVisitantesBibliotecaVirtual_parametrosNombradosEnDistintosEscenarios() {
        LocalDateTime inicio = LocalDateTime.of(2024, 1, 10, 8, 0);
        LocalDateTime fin = inicio.plusDays(1);

        ejecutarYVerificar("sin filtros",
                null, null, null, null, null, null, null, null, null);

        ejecutarYVerificar("con fecha de inicio",
                inicio, null, null, null, null, null, null, null, null);

        ejecutarYVerificar("con fecha de fin",
                null, fin, null, null, null, null, null, null, null);

        ejecutarYVerificar("con fecha de inicio y fin",
                inicio, fin, null, null, null, null, null, null, null);

        ejecutarYVerificar("con código de usuario",
                null, null, "  usuario.prueba  ", null, null, null, null, null, null);

        ejecutarYVerificar("con sede",
                null, null, null, " sede-lima ", null, null, null, null, null);

        ejecutarYVerificar("con tipo de usuario",
                null, null, null, null, 3, null, null, null, null);

        ejecutarYVerificar("con escuela",
                null, null, null, null, null, " escuela ", null, null, null);

        ejecutarYVerificar("con programa",
                null, null, null, null, null, null, " programa ", null, null);

        ejecutarYVerificar("con ciclo",
                null, null, null, null, null, null, null, " ciclo ", null);

        ejecutarYVerificar("con base de datos",
                null, null, null, null, null, null, null, null, 9L);

        ejecutarYVerificar("con todos los filtros",
                inicio, fin, " usuario.total ", " sede-centro ", 2,
                " escuela-total ", " programa-total ", " ciclo-total ", 15L);
    }

    private void ejecutarYVerificar(String escenario,
                                     LocalDateTime fechaInicio,
                                     LocalDateTime fechaFinExclusiva,
                                     String codigoUsuario,
                                     String codigoSede,
                                     Integer tipoUsuario,
                                     String codigoEscuela,
                                     String codigoPrograma,
                                     String ciclo,
                                     Long baseId) {
        clearInvocations(namedParameterJdbcTemplate);

        List<VisitanteBibliotecaVirtualDTO> resultado = prestamoService.reporteVisitantesBibliotecaVirtual(
                fechaInicio,
                fechaFinExclusiva,
                codigoUsuario,
                codigoSede,
                tipoUsuario,
                codigoEscuela,
                codigoPrograma,
                ciclo,
                baseId
        );

        assertNotNull(resultado, "El resultado no debe ser nulo en el escenario: " + escenario);

        ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<SqlParameterSource> paramsCaptor = ArgumentCaptor.forClass(SqlParameterSource.class);

        verify(namedParameterJdbcTemplate).query(sqlCaptor.capture(), paramsCaptor.capture(), any(RowMapper.class));

        String sql = sqlCaptor.getValue();
        SqlParameterSource paramSource = paramsCaptor.getValue();
        assertNotNull(sql, "La sentencia SQL no debe ser nula en el escenario: " + escenario);
        assertNotNull(paramSource, "Los parámetros no deben ser nulos en el escenario: " + escenario);
        assertFalse(sql.contains("?"), "No deben quedar placeholders posicionales en el escenario: " + escenario);

        assertTrue(paramSource instanceof MapSqlParameterSource,
                "Se espera MapSqlParameterSource para acceder a los valores en el escenario: " + escenario);
        MapSqlParameterSource mapSource = (MapSqlParameterSource) paramSource;
        Map<String, Object> values = mapSource.getValues();
        Set<String> actualNames = new LinkedHashSet<>(values.keySet());

        String sedeNormalizada = normalizar(codigoSede);
        String escuelaNormalizada = normalizar(codigoEscuela);
        String programaNormalizado = normalizar(codigoPrograma);
        String cicloNormalizado = normalizar(ciclo);
        String codigoNormalizado = normalizar(codigoUsuario);

        Set<String> expectedNames = new LinkedHashSet<>();
        if (fechaInicio != null) {
            expectedNames.add("fechaInicio");
        }
        if (fechaFinExclusiva != null) {
            expectedNames.add("fechaFinExclusiva");
        }
        if (sedeNormalizada != null) {
            expectedNames.add("codigoSede");
        }
        if (tipoUsuario != null && tipoUsuario != 0) {
            expectedNames.add("tipoUsuario");
        }
        if (escuelaNormalizada != null) {
            expectedNames.add("codigoEscuela");
        }
        if (programaNormalizado != null) {
            expectedNames.add("codigoPrograma");
        }
        if (cicloNormalizado != null) {
            expectedNames.add("codigoCiclo");
        }
        if (baseId != null && baseId != 0L) {
            expectedNames.add("baseId");
        }
        if (codigoNormalizado != null) {
            expectedNames.add("codigoFiltro");
        }

        assertEquals(expectedNames, actualNames,
                "Los parámetros nombrados deben coincidir con los filtros aplicados en el escenario: " + escenario);

        if (fechaInicio != null) {
            assertEquals(Timestamp.valueOf(fechaInicio), values.get("fechaInicio"),
                    "La fecha de inicio debe convertirse a Timestamp en el escenario: " + escenario);
            assertTrue(sql.contains(":fechaInicio"), "Debe usarse :fechaInicio en el SQL del escenario: " + escenario);
        }
        if (fechaFinExclusiva != null) {
            assertEquals(Timestamp.valueOf(fechaFinExclusiva), values.get("fechaFinExclusiva"),
                    "La fecha de fin exclusiva debe convertirse a Timestamp en el escenario: " + escenario);
            assertTrue(sql.contains(":fechaFinExclusiva"), "Debe usarse :fechaFinExclusiva en el SQL del escenario: " + escenario);
        }
        if (sedeNormalizada != null) {
            assertEquals(sedeNormalizada, values.get("codigoSede"),
                    "La sede debe normalizarse a mayúsculas en el escenario: " + escenario);
            assertTrue(sql.contains(":codigoSede"), "Debe usarse :codigoSede en el SQL del escenario: " + escenario);
        }
        if (tipoUsuario != null && tipoUsuario != 0) {
            assertEquals(tipoUsuario, values.get("tipoUsuario"),
                    "El tipo de usuario debe propagarse sin transformar en el escenario: " + escenario);
            assertTrue(sql.contains(":tipoUsuario"), "Debe usarse :tipoUsuario en el SQL del escenario: " + escenario);
        }
        if (escuelaNormalizada != null) {
            assertEquals(escuelaNormalizada, values.get("codigoEscuela"),
                    "La escuela debe normalizarse a mayúsculas en el escenario: " + escenario);
            assertTrue(sql.contains(":codigoEscuela"), "Debe usarse :codigoEscuela en el SQL del escenario: " + escenario);
        }
        if (programaNormalizado != null) {
            assertEquals(programaNormalizado, values.get("codigoPrograma"),
                    "El programa debe normalizarse a mayúsculas en el escenario: " + escenario);
            assertTrue(sql.contains(":codigoPrograma"), "Debe usarse :codigoPrograma en el SQL del escenario: " + escenario);
        }
        if (cicloNormalizado != null) {
            assertEquals(cicloNormalizado, values.get("codigoCiclo"),
                    "El ciclo debe normalizarse a mayúsculas en el escenario: " + escenario);
            assertTrue(sql.contains(":codigoCiclo"), "Debe usarse :codigoCiclo en el SQL del escenario: " + escenario);
        }
        if (baseId != null && baseId != 0L) {
            assertEquals(baseId, values.get("baseId"),
                    "El identificador de base debe propagarse sin transformar en el escenario: " + escenario);
            assertTrue(sql.contains(":baseId"), "Debe usarse :baseId en el SQL del escenario: " + escenario);
        }
        if (codigoNormalizado != null) {
            assertEquals(codigoNormalizado, values.get("codigoFiltro"),
                    "El código debe normalizarse a mayúsculas en el escenario: " + escenario);
            assertTrue(sql.contains(":codigoFiltro"), "Debe usarse :codigoFiltro en el SQL del escenario: " + escenario);
        }
    }

    private String normalizar(String valor) {
        if (valor == null) {
            return null;
        }
        String trimmed = valor.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.toUpperCase();
    }
}

