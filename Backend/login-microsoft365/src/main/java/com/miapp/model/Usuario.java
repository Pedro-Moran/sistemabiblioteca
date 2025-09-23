package com.miapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
@Table(name = "USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDUSUARIO")
    @JsonProperty("id")
    private Long idUsuario;

    // Clave foránea a SEDE
    @Column(name = "IDSEDE")
    private Long idSede;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDPROGRAMA")
    private Programa programa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDESPECIALIDAD")
    private Especialidad especialidad;

    @Column(name = "CICLO")
    private String ciclo;


    // Nueva relación: un usuario puede tener muchos roles y un rol puede asignarse a muchos usuarios
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "USUARIO_ROL",
            joinColumns = @JoinColumn(name = "IDUSUARIO"),
            inverseJoinColumns = @JoinColumn(name = "IDROL")
    )
    private Set<Rol> roles = new HashSet<>();

    @Column(name = "NOMBREUSUARIO", length = 50)
    private String nombreUsuario;

    @Column(name = "APELLIDOPATERNO", length = 50)
    private String apellidoPaterno;

    @Column(name = "APELLIDOMATERNO", length = 50)
    private String apellidoMaterno;

    @Column(name = "FECHANACIMIENTO")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime fechaNacimiento;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "EMAILPERSONAL", length = 100)
    private String emailPersonal;

    @Column(name = "LOGIN", length = 80)
    private String login;

    @Column(name = "PASSWORD", length = 80)
    private String password;

    @Column(name = "HORATRABAJO", length = 20)
    private String horaTrabajo;

    @Column(name = "FECHACREACION")
    private LocalDateTime fechaCreacion;

    @Column(name = "USUARIOCREACION", length = 30)
    private String usuarioCreacion;

    @Column(name = "FECHAMODIFICACION")
    private LocalDateTime fechaModificacion;

    @Column(name = "USUARIOMODIFICACION", length = 30)
    private String usuarioModificacion;

    // Clave foránea a ESTADO
    @Column(name = "IDESTADO")
    private String idEstado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDTIPODOCUMENTO")
    private TipoDocumento tipodocumento;

    @Column(name = "NUMDOCUMENTO")
    private Long numDocumento;

    @Column(name = "TELEFONO")
    private Long telefono;

    @Column(name = "DIRECCION")
    private String direccion;

    /** Contador de logeos acumulados */
    @Column(name = "LOGIN_COUNT")
    private Long loginCount = 0L;

    @JsonProperty("EMPLID")
    @Column(name = "EMPLID")
    private String emplid;

    @JsonProperty("NATIONAL_ID_TYPE")
    @Column(name = "NATIONAL_ID_TYPE")
    private String nationalIdType;

    @JsonProperty("NATIONAL_ID")
    @Column(name = "NATIONAL_ID")
    private String nationalId;

    @JsonProperty("NAME")
    @Column(name = "NAME")
    private String name;

    @JsonProperty("PROGRAM")
    @Column(name = "PROGRAM")
    private String program;

    @JsonProperty("CAMPUS")
    @Column(name = "CAMPUS")
    private String campus;

    @JsonProperty("FEC_NAC")
    @Column(name = "FEC_NAC")
    private String fecNac;

    @JsonProperty("COUNTRY")
    @Column(name = "COUNTRY")
    private String country;

    @JsonProperty("STATE")
    @Column(name = "STATE")
    private String state;

    @JsonProperty("COUNTY")
    @Column(name = "COUNTY")
    private String county;

    @JsonProperty("CITY")
    @Column(name = "CITY")
    private String city;

    @JsonProperty("ADDRESS")
    @Column(name = "ADDRESS")
    private String address;

    @JsonProperty("PHONE")
    @Column(name = "PHONE")
    private String phone;

    @JsonProperty("CELL")
    @Column(name = "CELL")
    private String cell;

    @JsonProperty("SEX")
    @Column(name = "SEX")
    private String sex;

    @JsonProperty("AGE")
    @Column(name = "AGE")
    private Integer age;

    @JsonProperty("EMAIL_INST")
    @Column(name = "EMAIL_INST")
    private String emailInst;

}