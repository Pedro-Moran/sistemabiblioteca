package com.miapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa la configuración local de un perfil proveniente de Microsoft 365.
 * Cada registro enlaza el identificador del grupo en Azure AD con un rol de la
 * plataforma para poder validar qué perfiles puede seleccionar un usuario al
 * autenticarse con Microsoft.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "PERFIL_MICROSOFT")
public class PerfilMicrosoft {

    /**
     * Identificador del grupo en Azure AD. Se usa como clave primaria para evitar
     * dependencias de secuencias específicas de la base de datos y garantizar que
     * el GUID permanezca único en todas las instalaciones.
     */
    @Id
    @Column(name = "GRAPH_GROUP_ID", nullable = false, length = 64)
    private String graphGroupId;

    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDROL", nullable = false)
    private Rol rol;
}