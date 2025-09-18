-- Script de actualización de la tabla ESPECIALIDAD
-- Ajusta la estructura para incorporar el código de especialidad, la relación con PROGRAMA
-- y registra el catálogo entregado por el área usuaria.

PROMPT ==== Verificando columna CODIGO_ESPECIALIDAD ====
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_TAB_COLUMNS
     WHERE TABLE_NAME = 'ESPECIALIDAD'
       AND COLUMN_NAME = 'CODIGO_ESPECIALIDAD';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE ESPECIALIDAD ADD (CODIGO_ESPECIALIDAD VARCHAR2(20 CHAR))';
    END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE ESPECIALIDAD MODIFY (CODIGO_ESPECIALIDAD VARCHAR2(20 CHAR) NOT NULL)';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE NOT IN (-1442, -1451) THEN
            RAISE;
        END IF;
END;
/

PROMPT ==== Verificando columna IDPROGRAMA ====
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_TAB_COLUMNS
     WHERE TABLE_NAME = 'ESPECIALIDAD'
       AND COLUMN_NAME = 'IDPROGRAMA';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE ESPECIALIDAD ADD (IDPROGRAMA NUMBER(10))';
    END IF;
END;
/

PROMPT ==== Creando clave foránea hacia PROGRAMA ====
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_CONSTRAINTS
     WHERE TABLE_NAME = 'ESPECIALIDAD'
       AND CONSTRAINT_NAME = 'FK_ESPECIALIDAD_PROGRAMA';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE ESPECIALIDAD '
            || 'ADD CONSTRAINT FK_ESPECIALIDAD_PROGRAMA '
            || 'FOREIGN KEY (IDPROGRAMA) REFERENCES PROGRAMA(IDPROGRAMA)';
    END IF;
END;
/

PROMPT ==== Creando restricción única para CODIGO_ESPECIALIDAD ====
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM USER_CONSTRAINTS
     WHERE TABLE_NAME = 'ESPECIALIDAD'
       AND CONSTRAINT_NAME = 'UK_ESPECIALIDAD_CODIGO';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE ESPECIALIDAD '
            || 'ADD CONSTRAINT UK_ESPECIALIDAD_CODIGO '
            || 'UNIQUE (CODIGO_ESPECIALIDAD)';
    END IF;
END;
/

PROMPT ==== Normalizando datos existentes ====
UPDATE ESPECIALIDAD
   SET CODIGO_ESPECIALIDAD = UPPER(TRIM(CODIGO_ESPECIALIDAD))
 WHERE CODIGO_ESPECIALIDAD IS NOT NULL;

UPDATE ESPECIALIDAD
   SET DESCRIPCION = TRIM(DESCRIPCION)
 WHERE DESCRIPCION IS NOT NULL;

PROMPT ==== Preparando catálogo de especialidades proporcionado ====
CREATE OR REPLACE VIEW VW_TMP_ESPECIALIDAD_DATOS AS
            SELECT 'RMED' AS codigo_programa, 'P55RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - MEDICINA FAMILIAR' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P61RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - ORTOPEDIA Y TRAUMATOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P64RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - PSIQUIATRÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTIS' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE INGENIERÍA DE COMPUTACIÓN Y SISTEMAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTAN' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE ADMINISTRACIÓN DE NEGOCIOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLIA' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE INGENIERÍA AGROINDUSTRIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DEPU' AS codigo_programa, 'PDEPU' AS codigo_especialidad, 'PROGRAMA DE EDUCACIÓN CONTINUA DEPU' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P001R' AS codigo_especialidad, 'MEDICINA HUMANA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DDEC' AS codigo_programa, 'EC001' AS codigo_especialidad, 'PROGRAMA DE ESPECIALIZACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL14' AS codigo_especialidad, 'HNL MEDICINA VETERINARIA Y ZOOTECNIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P008S' AS codigo_especialidad, 'CONTABILIDAD - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P45MS' AS codigo_especialidad, 'MAESTRÍA EN DERECHO ADMINISTRATIVO Y GESTIÓN PÚBLICA  - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P37MA' AS codigo_especialidad, 'MAESTRÍA EN DERECHO CIVIL Y COMERCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P43MA' AS codigo_especialidad, 'MAESTRÍA EN DERECHO CONSTITUCIONAL Y GOBERNABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P39MD' AS codigo_especialidad, 'MAESTRÍA EN GESTIÓN ESTRATÉGICA EMPRESARIAL - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P003C' AS codigo_especialidad, 'DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P53RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - GASTRO ENTEROLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P54RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - GINECOLOGIA Y OBSTETRICIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P56RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - MEDICINA INTERNA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTEN' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE ENFERMERÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTCC' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE CIENCIAS DE LA COMUNICACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLDE' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLCO' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE CONTABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P70SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ESTOMATOLOGÍA EN PERIODONCIA E IMPLANTOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL32' AS codigo_especialidad, 'HNL IA INGENIERÍA AGROINDUSTRIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P032S' AS codigo_especialidad, 'INGENIERÍA AGROINDUSTRIAL SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P39MA' AS codigo_especialidad, 'MAESTRÍA EN GESTIÓN ESTRATÉGICA EMPRESARIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P003D' AS codigo_especialidad, 'DERECHO - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P006R' AS codigo_especialidad, 'ADMINISTRACIÓN DE NEGOCIOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P014S' AS codigo_especialidad, 'MEDICINA VETERINARIA Y ZOOTECNIA SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P35MS' AS codigo_especialidad, 'MAESTRÍA EN SALUD PÚBLICA - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLSE' AS codigo_especialidad, 'HNL SEGUNDAS ESPECIALIDADES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'CEPU' AS codigo_programa, 'CEP_R' AS codigo_especialidad, 'PROGRAMA CEPU REGULAR' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P41MA' AS codigo_especialidad, 'MAESTRÍA EN DERECHO PROCESAL PENAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P35MD' AS codigo_especialidad, 'MAESTRÍA EN SALUD PÚBLICA - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P004R' AS codigo_especialidad, 'CIENCIAS DE LA COMUNICACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREM' AS codigo_programa, 'P006M' AS codigo_especialidad, 'ADMINISTRACIÓN DE NEGOCIOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREM' AS codigo_programa, 'P008M' AS codigo_especialidad, 'CONTABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'IDIO' AS codigo_programa, 'PINGL' AS codigo_especialidad, 'PROGRAMA INGLES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTTT' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE TECNOLOGÍA MÉDICA, ESPECIALIDAD DE TERAPIA FÍSICA Y REHABILITACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLCC' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE CIENCIAS DE LA COMUNICACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLTT' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE TECNOLOGÍA MÉDICA, ESPECIALIDAD DE TERAPIA FÍSICA Y REHABILITACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLIC' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE INGENIERÍA CIVIL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P031C' AS codigo_especialidad, 'PSICOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P033C' AS codigo_especialidad, 'INGENIERÍA CIVIL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL08' AS codigo_especialidad, 'HNL CONTABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'IDIO' AS codigo_programa, 'PFRAN' AS codigo_especialidad, 'PROGRAMA FRANCES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'IDIO' AS codigo_programa, 'PPORT' AS codigo_especialidad, 'PROGRAMA PORTUGUES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'RPREG' AS codigo_especialidad, 'REVALIDACIÓN DE PREGRADO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P028R' AS codigo_especialidad, 'TECNOLOGÍA MÉDICA, ESPECIALIDAD DE TERAPIA FÍSICA Y REHABILITACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P029R' AS codigo_especialidad, 'TECNOLOGÍA MÉDICA, ESPECIALIDAD DE LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P032R' AS codigo_especialidad, 'INGENIERÍA AGROINDUSTRIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P053S' AS codigo_especialidad, 'ADMINISTRACIÓN DE EMPRESAS SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P37MS' AS codigo_especialidad, 'MAESTRÍA EN DERECHO CIVIL Y COMERCIAL - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P13SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ESTOMATOLOGIA EN ORTODONCIA Y ORTOPEDIA MAXILAR' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLGT' AS codigo_especialidad, 'HNL GESTIÓN DE TESIS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL05' AS codigo_especialidad, 'HNL INGENIERIA DE COMPUTACION' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL06' AS codigo_especialidad, 'HNL ADMINISTRACION DE NEGOCIOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL16' AS codigo_especialidad, 'HNL SEGUNDA ESPECIALIDAD DE ENFERMERIA EN ATENCION INTEGRAL DEL NIÑO Y ADOLESCENTE' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DIPL' AS codigo_programa, 'P73DP' AS codigo_especialidad, 'DIPLOMADO INTERNACIONAL EN MARKETING Y COMERCIALIZACIÓN VITIVINICOLA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P030S' AS codigo_especialidad, 'TURISMO, HOTELERÍA Y GASTRONOMÍA SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P006S' AS codigo_especialidad, 'ADMINISTRACIÓN DE NEGOCIOS SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P075D' AS codigo_especialidad, 'INGENIERIA DE SISTEMAS - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P39MS' AS codigo_especialidad, 'MAESTRÍA EN GESTIÓN ESTRATÉGICA EMPRESARIAL - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P43MS' AS codigo_especialidad, 'MAESTRÍA EN DERECHO CONSTITUCIONAL Y GOBERNABILIDAD - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLMA' AS codigo_especialidad, 'HNL MAESTRIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREM' AS codigo_programa, 'P005M' AS codigo_especialidad, 'INGENIERÍA DE COMPUTACIÓN Y SISTEMAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P008C' AS codigo_especialidad, 'CONTABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P47RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - ADMINISTRACIÓN Y GESTIÓN EN SALUD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P51RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - DERMATOLOGIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P52RM' AS codigo_especialidad, 'RM. SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - ENDOCRINOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P62RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - OTORRINOLARINGOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTCO' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE CONTABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTVZ' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE MEDICINA VETERINARIA Y ZOOTECNIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLAN' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE ADMINISTRACIÓN DE NEGOCIOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLVZ' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE MEDICINA VETERINARIA Y ZOOTECNIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL03' AS codigo_especialidad, 'HNL DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P70MD' AS codigo_especialidad, 'MAESTRÍA EN SALUD OCUPACIONAL Y AMBIENTAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P050S' AS codigo_especialidad, 'INGENIERÍA DE SISTEMAS SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P008R' AS codigo_especialidad, 'CONTABILIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P37MD' AS codigo_especialidad, 'MAESTRÍA EN DERECHO CIVIL Y COMERCIAL - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DABE' AS codigo_programa, 'DAB02' AS codigo_especialidad, 'NIVELACION' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL11' AS codigo_especialidad, 'HNL TM TERAPIA FISICA Y REHABILITACION' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P031R' AS codigo_especialidad, 'PSICOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTBLD' AS codigo_especialidad, 'BACHILLER DE OTRAS UNIVERCIDADES CON LICENCIA DENEGADA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'TTFCS' AS codigo_especialidad, 'T.T FAC.CIENCIA DE SALUD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P45MD' AS codigo_especialidad, 'MAESTRÍA EN DERECHO ADMINISTRATIVO Y GESTIÓN PÚBLICA - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P41MD' AS codigo_especialidad, 'MAESTRÍA EN DERECHO PROCESAL PENAL - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLDD' AS codigo_especialidad, 'HNL DESARROLLO DOCENTE' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P030R' AS codigo_especialidad, 'TURISMO, HOTELERÍA Y GASTRONOMÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'RSESP' AS codigo_especialidad, 'REVALIDACIÓN SEGUNDAS ESPECIALIDADES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P45MA' AS codigo_especialidad, 'MAESTRÍA EN DERECHO ADMINISTRATIVO Y GESTIÓN PÚBLICA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLDB' AS codigo_especialidad, 'HNL DABE' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLVR' AS codigo_especialidad, 'HNL  VRAI' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREM' AS codigo_programa, 'P003M' AS codigo_especialidad, 'DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P006C' AS codigo_especialidad, 'ADMINISTRACIÓN DE NEGOCIOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P49RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - CARDIOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P63RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - PEDIATRÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P65RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - REUMATOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTMH' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE MEDICINA HUMANA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTTL' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE TECNOLOGÍA MÉDICA, ESPECIALIDAD DE LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLEN' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE ENFERMERÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLIS' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE INGENIERÍA DE COMPUTACIÓN Y SISTEMAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLHG' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE TURISMO, HOTELERÍA Y GASTRONOMÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL17' AS codigo_especialidad, 'HNL SEE CUIDADOS CARDIOLOGICOS Y CARDIOVASCULARES CON MENCION EN CIRUGIA CARDIACA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'IDIO' AS codigo_programa, 'PITAL' AS codigo_especialidad, 'PROGRAMA ITALIANO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P003R' AS codigo_especialidad, 'DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTMA' AS codigo_especialidad, 'T.T MAESTRIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P017R' AS codigo_especialidad, 'ADMINISTRACIÓN DE EMPRESAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P031S' AS codigo_especialidad, 'PSICOLOGÍA SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLCG' AS codigo_especialidad, 'HNL CURSOS GENERALES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLEV' AS codigo_especialidad, 'HNL EDUCACIÓN VIRTUAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLRS' AS codigo_especialidad, 'HNL RESPONSABILIDAD SOCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL29' AS codigo_especialidad, 'HNL TECNOLOGIA MEDICA, ESPECIALIDAD DE LABORATORIO CLINICO Y ANATOMIA PATOLOGICA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL33' AS codigo_especialidad, 'HORAS NO LECTIVAS INGENIERÍA CIVIL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P008D' AS codigo_especialidad, 'CONTABILIDAD - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL27' AS codigo_especialidad, 'HNL  INGENIERIA EN ENOLOGIA Y VITICULTURA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P69MD' AS codigo_especialidad, 'MAESTRÍA EN DERECHO, GESTIÓN PARLAMENTARIA Y SISTEMAS ELECTORALES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P005S' AS codigo_especialidad, 'INGENIERÍA DE COMPUTACIÓN Y SISTEMAS SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREM' AS codigo_programa, 'P004M' AS codigo_especialidad, 'CIENCIAS DE LA COMUNICACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P005C' AS codigo_especialidad, 'INGENIERÍA DE COMPUTACIÓN Y SISTEMAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DOCT' AS codigo_programa, 'P34DO' AS codigo_especialidad, 'DOCTORADO EN ENFERMERIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P58RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - NEUMOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P60RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - OFTALMOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTHG' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE TURISMO, HOTELERÍA Y GASTRONOMÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTPS' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE PSICOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLMH' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE MEDICINA HUMANA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLIE' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE INGENIERÍA EN ENOLOGÍA Y VITICULTURA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLPS' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE PSICOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P002R' AS codigo_especialidad, 'ENFERMERÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P027R' AS codigo_especialidad, 'INGENIERÍA EN ENOLOGÍA Y VITICULTURA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P71MD' AS codigo_especialidad, 'MAESTRÍA EN GESTIÓN EDUCATIVA Y SISTEMAS INTEGRADOS DE CALIDAD' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P26SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ESTOMATOLOGIA EN ODONTOPEDIATRIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DABE' AS codigo_programa, 'DAB01' AS codigo_especialidad, 'TALLERES CULTURALES Y DEPORTIVOS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P073D' AS codigo_especialidad, 'ADMINISTRACIÓN DE EMPRESAS - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL02' AS codigo_especialidad, 'HNL ENFERMERIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL31' AS codigo_especialidad, 'HNL PSICOLOGIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P003S' AS codigo_especialidad, 'DERECHO SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P007R' AS codigo_especialidad, 'ESTOMATOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P013R' AS codigo_especialidad, 'INGENIERÍA DE SISTEMAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P18SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ENFERMERIA EN EMERGENCIAS Y DESASTRES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P009R' AS codigo_especialidad, 'TURISMO, HOTELERÍA Y GESTIÓN CULTURAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DOCT' AS codigo_programa, 'P22DO' AS codigo_especialidad, 'DOCTORADO EN DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P57RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - MEDICINA OCUPACIONAL Y DEL MEDIO AMBIENTE' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P59RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - NEUROLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTES' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE ESTOMATOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTIA' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE INGENIERÍA AGROINDUSTRIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTIC' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE INGENIERÍA CIVIL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'CEPU' AS codigo_programa, 'PCEMH' AS codigo_especialidad, 'PROGRAMA CEPU MEDICINA HUMANA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTDO' AS codigo_especialidad, 'T.T DOCTORADO EN ENFERMERIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P16SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ENFERMERIA EN ATENCION INTEGRAL DEL NIÑO Y ADOLESCENTE' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P033R' AS codigo_especialidad, 'INGENIERÍA CIVIL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P17SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ENFERMERIA EN CUIDADOS CARDIOLOGICOS Y CARDIOVASCULARES CON MENCION EN CIRUGIA CARDIACA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P027S' AS codigo_especialidad, 'INGENIERÍA EN ENOLOGÍA Y VITICULTURA SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P10SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ESTOMATOLOGIA EN REHABILITACIÓN ORAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'TTTSP' AS codigo_especialidad, 'TALLER DE TITULACIÓN POR TRABAJO DE SUFICIENCIA PROFESIONAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREC' AS codigo_programa, 'P002C' AS codigo_especialidad, 'ENFERMERÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P48RM' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - ANESTESIOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'RMED' AS codigo_programa, 'P50RM' AS codigo_especialidad, 'RM. SEGUNDA ESPECIALIDAD EN MEDICINA HUMANA - CIRUGIA GENERAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTDE' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE DERECHO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTTIE' AS codigo_especialidad, 'PROGRAMA CURSO DE TITULACIÓN DE INGENIERÍA EN ENOLOGÍA Y VITICULTURA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLES' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE ESTOMATOLOGÍA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'PTLTL' AS codigo_especialidad, 'PROGRAMA TALLER DE TESIS DE TECNOLOGÍA MÉDICA, ESPECIALIDAD DE LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'DIPL' AS codigo_programa, 'P74DP' AS codigo_especialidad, 'DIPLOMADO EN BIOÉTICA E INVESTIGACIÓN' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL01' AS codigo_especialidad, 'HNL MEDICINA HUMANA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL18' AS codigo_especialidad, 'HNL SEE EMERGENCIAS Y DESASTRES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'SESP' AS codigo_programa, 'P71SE' AS codigo_especialidad, 'SEGUNDA ESPECIALIDAD DE ESTOMATOLOGÍA EN ENDODONCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'TITU' AS codigo_programa, 'RRMED' AS codigo_especialidad, 'REVALIDACIÓN DE RESIDENTADO MÉDICO SEGUNDAS ESPECIALIDADES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P005R' AS codigo_especialidad, 'INGENIERÍA DE COMPUTACIÓN Y SISTEMAS' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P43MD' AS codigo_especialidad, 'MAESTRÍA EN DERECHO CONSTITUCIONAL Y GOBERNABILIDAD - A DISTANCIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL04' AS codigo_especialidad, 'HNL CIENCIAS DE LA COMUNICACION' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PLID' AS codigo_programa, 'P001L' AS codigo_especialidad, 'PROGRAM LIDERES' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P35MA' AS codigo_especialidad, 'MAESTRÍA EN SALUD PÚBLICA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLRM' AS codigo_especialidad, 'HNL RESIDENTADO MÉDICO' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL07' AS codigo_especialidad, 'HNL ESTOMATOLOGIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNL30' AS codigo_especialidad, 'HNL TURISMO, HOTELERIA Y GASTRONOMIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P014R' AS codigo_especialidad, 'MEDICINA VETERINARIA Y ZOOTECNIA' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'PREG' AS codigo_programa, 'P033S' AS codigo_especialidad, 'INGENIERÍA CIVIL SEMI - PRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'MAES' AS codigo_programa, 'P41MS' AS codigo_especialidad, 'MAESTRÍA EN DERECHO PROCESAL PENAL - SEMIPRESENCIAL' AS descripcion_especialidad FROM dual
            UNION ALL
            SELECT 'HNLC' AS codigo_programa, 'HNLSV' AS codigo_especialidad, 'HL SEGUIMIENTO EGRESADO' AS descripcion_especialidad FROM dual
;

PROMPT ==== Registrando catálogo de especialidades ====
MERGE INTO ESPECIALIDAD e
USING (
    SELECT UPPER(TRIM(d.codigo_especialidad)) AS codigo_especialidad,
           TRIM(d.descripcion_especialidad) AS descripcion_especialidad,
           p.IDPROGRAMA
      FROM VW_TMP_ESPECIALIDAD_DATOS d
      JOIN PROGRAMA p
        ON UPPER(p.PROGRAMA) = UPPER(TRIM(d.codigo_programa))
) datos
   ON (UPPER(e.CODIGO_ESPECIALIDAD) = datos.codigo_especialidad)
 WHEN MATCHED THEN
   UPDATE SET e.DESCRIPCION = datos.descripcion_especialidad,
              e.IDPROGRAMA = datos.IDPROGRAMA,
              e.ACTIVO = 1
 WHEN NOT MATCHED THEN
   INSERT (CODIGO_ESPECIALIDAD, DESCRIPCION, IDPROGRAMA, ACTIVO)
   VALUES (datos.codigo_especialidad, datos.descripcion_especialidad, datos.IDPROGRAMA, 1);

PROMPT ==== Desactivando especialidades no incluidas en la fuente ====
UPDATE ESPECIALIDAD e
   SET e.ACTIVO = 0
 WHERE NOT EXISTS (
        SELECT 1
          FROM VW_TMP_ESPECIALIDAD_DATOS d
         WHERE UPPER(e.CODIGO_ESPECIALIDAD) = UPPER(d.codigo_especialidad)
      );

PROMPT ==== Eliminando catálogo temporal ====
BEGIN
    EXECUTE IMMEDIATE 'DROP VIEW VW_TMP_ESPECIALIDAD_DATOS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

PROMPT ==== Validando integridad de IDPROGRAMA ====
DECLARE
    v_nulls NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_nulls
      FROM ESPECIALIDAD
     WHERE IDPROGRAMA IS NULL;

    IF v_nulls = 0 THEN
        BEGIN
            EXECUTE IMMEDIATE 'ALTER TABLE ESPECIALIDAD MODIFY (IDPROGRAMA NUMBER(10) NOT NULL)';
        EXCEPTION
            WHEN OTHERS THEN
                IF SQLCODE NOT IN (-1442, -1451) THEN
                    RAISE;
                END IF;
        END;
    ELSE
        DBMS_OUTPUT.PUT_LINE('Advertencia: existen ' || v_nulls || ' especialidades sin programa asociado. Se omite la restricción NOT NULL en IDPROGRAMA.');
    END IF;
END;
/
-- COMMIT;
