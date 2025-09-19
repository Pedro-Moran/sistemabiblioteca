# Scripts SQL para login con Microsoft 365

Este directorio contiene utilidades para preparar la base de datos antes de ejecutar el backend con `spring.jpa.hibernate.ddl-auto=validate`.

## Tabla `PERFIL_MICROSOFT`

Ejecuta `crear_perfil_microsoft.sql` en el esquema correspondiente para crear la tabla utilizada al validar los grupos devueltos por Microsoft Graph.

```sql
@crear_perfil_microsoft.sql
```

### Insertar perfiles de ejemplo

Cada registro debe enlazar el identificador del grupo en Azure AD con el rol local existente en `ROLUSUARIO`. Un ejemplo básico:

```sql
INSERT INTO PERFIL_MICROSOFT (GRAPH_GROUP_ID, NOMBRE, IDROL)
VALUES ('41d09314-71f3-40fe-a70f-66fad7a164db', 'Grupo de Sistema biblioteca', 2);
```

Sustituye `IDROL` por el identificador real del rol en tu instancia (consulta `SELECT IDROL, DESCRIPCION FROM ROLUSUARIO;`).

Tras ejecutar los `INSERT`, confirma que los datos se reflejan:

```sql
SELECT GRAPH_GROUP_ID, NOMBRE, IDROL FROM PERFIL_MICROSOFT;
```

Estos registros permiten que el backend cruce los grupos del token delegado con los roles locales durante el login con Microsoft 365.
