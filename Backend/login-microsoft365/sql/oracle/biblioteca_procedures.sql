-- Procedimientos almacenados para Oracle Database 21c
-- Ejecutar este script conectándose con el esquema propietario de las tablas
-- (por ejemplo BIBLIOTECA, PEDRO, etc.).

-- Procedimiento para inactivar un equipo por su dirección IP
CREATE OR REPLACE PROCEDURE usp_DetallePrestamoEquipo_InactivarEquipo (
    p_NumeroIP        IN  EquipoLaboratorio.NumeroIP%TYPE,
    p_FilasAfectadas  OUT NUMBER
) AS
    v_IdDetallePrestamoEquipo DetallePrestamoEquipo.IdDetallePrestamoEquipo%TYPE;
    v_TotalActualizaciones    NUMBER := 0;
BEGIN
    UPDATE ControlPrestamoEquipo cpe
       SET cpe.FechaFin = SYSDATE,
           cpe.IdEstado = 0
     WHERE cpe.IdEstado = 1
       AND EXISTS (
               SELECT 1
                 FROM DetallePrestamoEquipo dpe
                 JOIN EquipoLaboratorio el
                   ON dpe.IdEquipoLaboratorio = el.IdEquipoLaboratorio
                WHERE dpe.IdDetallePrestamoEquipo = cpe.IdDetallePrestamoEquipo
                  AND el.NumeroIP = p_NumeroIP
           );
    v_TotalActualizaciones := v_TotalActualizaciones + SQL%ROWCOUNT;

    UPDATE EquipoLaboratorio el
       SET el.IdEstado = 2
     WHERE el.NumeroIP = p_NumeroIP;
    v_TotalActualizaciones := v_TotalActualizaciones + SQL%ROWCOUNT;

    BEGIN
        SELECT sub.IdDetallePrestamoEquipo
          INTO v_IdDetallePrestamoEquipo
          FROM (
                SELECT dpe.IdDetallePrestamoEquipo
                  FROM EquipoLaboratorio el
                  JOIN DetallePrestamoEquipo dpe
                    ON el.IdEquipoLaboratorio = dpe.IdEquipoLaboratorio
                 WHERE el.NumeroIP = p_NumeroIP
                 ORDER BY dpe.FechaSolicitud DESC
               ) sub
         WHERE ROWNUM = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_IdDetallePrestamoEquipo := NULL;
    END;

    IF v_IdDetallePrestamoEquipo IS NOT NULL THEN
        UPDATE DetallePrestamoEquipo dpe
           SET dpe.IdEstado = 7,
               dpe.UsuarioRecepcion = 'AUTOMATICO',
               dpe.FechaRecepcion = SYSDATE,
               dpe.UsuarioModificacion = 'AUTOMATICO',
               dpe.FechaModificacion = SYSDATE
         WHERE dpe.IdDetallePrestamoEquipo = v_IdDetallePrestamoEquipo;
        v_TotalActualizaciones := v_TotalActualizaciones + SQL%ROWCOUNT;
    END IF;

    p_FilasAfectadas := v_TotalActualizaciones;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END usp_DetallePrestamoEquipo_InactivarEquipo;
/

-- Procedimiento para validar si un equipo debe bloquearse por su IP
CREATE OR REPLACE PROCEDURE usp_DetallePrestamoEquipo_Validar (
    p_NumeroIP  IN  EquipoLaboratorio.NumeroIP%TYPE,
    p_Resultado OUT NUMBER
) AS
    v_IdEstado DetallePrestamoEquipo.IdEstado%TYPE;
BEGIN
    BEGIN
        SELECT sub.IdEstado
          INTO v_IdEstado
          FROM (
                SELECT dpe.IdEstado
                  FROM EquipoLaboratorio el
                  JOIN DetallePrestamoEquipo dpe
                    ON el.IdEquipoLaboratorio = dpe.IdEquipoLaboratorio
                  LEFT JOIN ControlPrestamoEquipo cpe
                    ON dpe.IdDetallePrestamoEquipo = cpe.IdDetallePrestamoEquipo
                 WHERE el.NumeroIP = p_NumeroIP
                   AND dpe.IdEstado IN (2, 3, 4, 9)
                   AND (cpe.IdEstado IS NULL OR cpe.IdEstado = 1)
                 ORDER BY dpe.FechaSolicitud DESC, dpe.IdDetallePrestamoEquipo DESC
               ) sub
         WHERE ROWNUM = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_IdEstado := 2;
    END;

    IF v_IdEstado IS NULL THEN
        v_IdEstado := 2;
    END IF;

    p_Resultado := v_IdEstado;
END usp_DetallePrestamoEquipo_Validar;
/
