-- Script de actualización de la tabla PROGRAMA
-- Ajusta la estructura para manejar el código (PROGRAMA) y la descripción (DESCRIPCION_PROGRAMA)
-- y registra los valores proporcionados por el área usuaria.

PROMPT ==== Normalizando columnas PROGRAMA y DESCRIPCION_PROGRAMA ====
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_TAB_COLUMNS
     WHERE TABLE_NAME = 'PROGRAMA'
       AND COLUMN_NAME = 'DESCRIPCION_PROGRAMA';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE PROGRAMA RENAME COLUMN DESCRIPCION TO DESCRIPCION_PROGRAMA';
    END IF;
END;
/

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_TAB_COLUMNS
     WHERE TABLE_NAME = 'PROGRAMA'
       AND COLUMN_NAME = 'PROGRAMA';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE PROGRAMA ADD (PROGRAMA VARCHAR2(20 CHAR))';
    END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE PROGRAMA MODIFY (PROGRAMA VARCHAR2(20 CHAR) NOT NULL)';
EXCEPTION
    WHEN OTHERS THEN
        -- ORA-01442: column to be modified to NOT NULL is already NOT NULL
        IF SQLCODE != -1442 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE PROGRAMA MODIFY (DESCRIPCION_PROGRAMA VARCHAR2(150 CHAR) NOT NULL)';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -1442 THEN
            RAISE;
        END IF;
END;
/

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_CONSTRAINTS
     WHERE TABLE_NAME = 'PROGRAMA'
       AND CONSTRAINT_NAME = 'UK_PROGRAMA_CODIGO';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE PROGRAMA ADD CONSTRAINT UK_PROGRAMA_CODIGO UNIQUE (PROGRAMA)';
    END IF;
END;
/

PROMPT ==== Registrando catálogo de programas ====
MERGE INTO PROGRAMA p
USING (
    SELECT programa,
           descripcion_programa
      FROM (
            SELECT programa,
                   descripcion_programa,
                   ROW_NUMBER() OVER (PARTITION BY programa ORDER BY orden DESC) rn
              FROM (
                    SELECT 'CEPU' AS programa, 'CEPU' AS descripcion_programa, 1 AS orden FROM dual
                    UNION ALL SELECT 'PLID', 'PROGRAMA LIDERES', 2 FROM dual
                    UNION ALL SELECT 'DDEC', 'DIR DE EDUCACIÓN CONTINUA', 3 FROM dual
                    UNION ALL SELECT 'DIPL', 'DIPLOMADO', 4 FROM dual
                    UNION ALL SELECT 'MAES', 'MAESTRIA', 5 FROM dual
                    UNION ALL SELECT 'PREC', 'PREGRADO CAPEA', 6 FROM dual
                    UNION ALL SELECT 'PREG', 'PREGRADO', 7 FROM dual
                    UNION ALL SELECT 'TITU', 'GRADOS Y TITULOS', 8 FROM dual
                    UNION ALL SELECT 'RMED', 'RESIDENTADO MEDICO', 9 FROM dual
                    UNION ALL SELECT 'DOCT', 'DOCTORADO', 10 FROM dual
                    UNION ALL SELECT 'HNLC', 'HORAS ADMINISTRATIVAS', 11 FROM dual
                    UNION ALL SELECT 'IDIO', 'CENTRO DE IDIOMAS', 12 FROM dual
                    UNION ALL SELECT 'SESP', 'SEGUNDA ESPECIALIDAD', 13 FROM dual
                    UNION ALL SELECT 'PREG', 'PREGRADO PRESENCIAL', 14 FROM dual
                    UNION ALL SELECT 'DABE', 'DIR ACOMPAÑ Y BIENEST AL ESTUD', 15 FROM dual
                    UNION ALL SELECT 'DEPU', 'EDUCACIÓN CONTINUA', 16 FROM dual
                    UNION ALL SELECT 'PREM', 'PREGRADO MODEA', 17 FROM dual
                   )
           )
     WHERE rn = 1
) d
   ON (p.PROGRAMA = d.PROGRAMA)
 WHEN MATCHED THEN
   UPDATE SET p.DESCRIPCION_PROGRAMA = d.DESCRIPCION_PROGRAMA,
              p.ACTIVO = 1
 WHEN NOT MATCHED THEN
   INSERT (PROGRAMA, DESCRIPCION_PROGRAMA, ACTIVO)
   VALUES (d.PROGRAMA, d.DESCRIPCION_PROGRAMA, 1);

PROMPT ==== Desactivando programas no incluidos en la fuente ====
UPDATE PROGRAMA p
   SET p.ACTIVO = 0
 WHERE p.PROGRAMA NOT IN (
        SELECT programa
          FROM (
                SELECT programa,
                       ROW_NUMBER() OVER (PARTITION BY programa ORDER BY orden DESC) rn
                  FROM (
                        SELECT 'CEPU' AS programa, 1 AS orden FROM dual
                        UNION ALL SELECT 'PLID', 2 FROM dual
                        UNION ALL SELECT 'DDEC', 3 FROM dual
                        UNION ALL SELECT 'DIPL', 4 FROM dual
                        UNION ALL SELECT 'MAES', 5 FROM dual
                        UNION ALL SELECT 'PREC', 6 FROM dual
                        UNION ALL SELECT 'PREG', 14 FROM dual -- Se conserva el último valor informado
                        UNION ALL SELECT 'TITU', 8 FROM dual
                        UNION ALL SELECT 'RMED', 9 FROM dual
                        UNION ALL SELECT 'DOCT', 10 FROM dual
                        UNION ALL SELECT 'HNLC', 11 FROM dual
                        UNION ALL SELECT 'IDIO', 12 FROM dual
                        UNION ALL SELECT 'SESP', 13 FROM dual
                        UNION ALL SELECT 'DABE', 15 FROM dual
                        UNION ALL SELECT 'DEPU', 16 FROM dual
                        UNION ALL SELECT 'PREM', 17 FROM dual
                       )
               )
         WHERE rn = 1
      );

-- Descomentar si se desea confirmar los cambios directamente desde el script
-- COMMIT;
