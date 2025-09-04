package com.miapp.service;

import com.miapp.model.*;
import com.miapp.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MaterialBibliograficoService {

    private final MaterialBibliograficoRepository materialBibliograficoRepository;
    private final TipoMaterialRepository tipoMaterialRepository;
    private final FileStorageService fileStorageService;


    public MaterialBibliograficoService(MaterialBibliograficoRepository materialBibliograficoRepository,
                                        TipoMaterialRepository tipoMaterialRepository,
                                        FileStorageService fileStorageService) {
        this.materialBibliograficoRepository = materialBibliograficoRepository;
        this.tipoMaterialRepository = tipoMaterialRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public MaterialBibliografico registerMaterial(MaterialBibliograficoDTO dto, MultipartFile portada) {

        // Crear y llenar la entidad MaterialBibliografico
        MaterialBibliografico material = new MaterialBibliografico();
        material.setCodigo(dto.getInformacionLibro().getCodigo());
        material.setTitulo(dto.getInformacionLibro().getTitulo());
        material.setLinkPublicacion(dto.getInformacionLibro().getLinkPublicacion());
        material.setDescripcion(dto.getInformacionLibro().getDescripcion());
        material.setNotasContenido(dto.getInformacionLibro().getNotasContenido());
        material.setNotaGeneral(dto.getInformacionLibro().getNotaGeneral());
        // Recupera la especialidad de la base de datos
        // material.setEspecialidad(especialidadRepository.findById(dto.getInformacionLibro().getEspecialidadId()).orElse(null));

        // Crear y llenar la entidad Editorial
        Editorial editorial = new Editorial();
        editorial.setAutorPersonal(dto.getInformacionEditorial().getAutorPersonal());
        editorial.setAutorSecundario(dto.getInformacionEditorial().getAutorSecundario());
        editorial.setAutorInstitucional(dto.getInformacionEditorial().getAutorInstitucional());
        editorial.setEditorial(dto.getInformacionEditorial().getEditorial());
        editorial.setCoordinador(dto.getInformacionEditorial().getCoordinador());
        editorial.setDirector(dto.getInformacionEditorial().getDirector());
        editorial.setCompilador(dto.getInformacionEditorial().getCompilador());
        editorial.setSerie(dto.getInformacionEditorial().getSerie());
        editorial.setDescripcionFisica(String.valueOf(dto.getInformacionEditorial().getDescripcionFisicaId()));
        editorial.setCantidad(dto.getInformacionEditorial().getCantidad());
        editorial.setAnioPublicacion(dto.getInformacionEditorial().getAnioPublicacion());
        editorial.setEdicion(dto.getInformacionEditorial().getEdicion());
        editorial.setReimpresion(dto.getInformacionEditorial().getReimpresion());
        editorial.setIsbn(dto.getInformacionEditorial().getIsbn());
        // Recupera Pais, Ciudad, Idioma con sus respectivos repositorios
        // editorial.setPais(paisRepository.findById(dto.getInformacionEditorial().getPaisId()).orElse(null));
        // editorial.setCiudad(ciudadRepository.findById(dto.getInformacionEditorial().getCiudadId()).orElse(null));
        // editorial.setIdioma(idiomaRepository.findById(dto.getInformacionEditorial().getIdiomaId()).orElse(null));

        // Relacionar
        editorial.setMaterialBibliografico(material);
        material.setEditorial(editorial);

        // Crear y llenar la entidad Detalle
        Detalle detalle = new Detalle();
        // Convierte dto.getDetalle().getFechaIngreso() a Date según requieras
        // detalle.setFechaIngreso(convertir(dto.getDetalle().getFechaIngreso()));
        detalle.setCosto(dto.getDetalle().getCosto() != null ? new java.math.BigDecimal(dto.getDetalle().getCosto()) : null);
        detalle.setNumeroFactura(dto.getDetalle().getNumeroFactura());
        if (portada != null && !portada.isEmpty()) {
            String filename = fileStorageService.store(portada);
            detalle.setPortadaLibroImg("/uploads/recursos/" + filename);
        } else {
            detalle.setPortadaLibroImg(dto.getDetalle().getPortadaLibroImg());
        }
        // Recupera Sede, TipoMaterial y TipoAdquisicion
        // detalle.setSede(sedeRepository.findById(dto.getDetalle().getSedeId()).orElse(null));
//         detalle.setTipoMaterial(tipoMaterialRepository.findById(dto.getDetalle().getTipoMaterialId()).orElse(null));
        TipoMaterialDTO tipoMaterialDTO = dto.getDetalle().getTipoMaterial();
        if (tipoMaterialDTO != null && tipoMaterialDTO.getIdTipoMaterial() != null) {
            TipoMaterial tipoMaterial = tipoMaterialRepository
                    .findById(tipoMaterialDTO.getIdTipoMaterial())
                    .orElseThrow(() -> new RuntimeException("Tipo de material no encontrado"));
            detalle.setTipoMaterial(tipoMaterial);
        } else {
            detalle.setTipoMaterial(null);
        }
        // detalle.setTipoAdquisicion(tipoAdquisicionRepository.findById(dto.getDetalle().getTipoAdquisicionId()).orElse(null));

        detalle.setMaterialBibliografico(material);
        material.setDetalles(Arrays.asList(detalle));

        // Persistir la entidad, gracias a CascadeType.ALL se guardan las entidades relacionadas
        return materialBibliograficoRepository.save(material);
    }

    @Transactional
    public MaterialBibliografico updateMaterial(Long id, MaterialBibliograficoDTO dto, MultipartFile portada) {

        // Buscar el material existente por su id
        MaterialBibliografico material = materialBibliograficoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado con id: " + id));

        // Actualizar la información del libro
        MaterialDTO infoLibro = dto.getInformacionLibro();
        material.setCodigo(infoLibro.getCodigo());
        material.setTitulo(infoLibro.getTitulo());
        material.setLinkPublicacion(infoLibro.getLinkPublicacion());
        material.setDescripcion(infoLibro.getDescripcion());
        material.setNotasContenido(infoLibro.getNotasContenido());
        material.setNotaGeneral(infoLibro.getNotaGeneral());
        // Por ejemplo, actualiza la especialidad usando el ID recibido:
        // material.setEspecialidad(especialidadRepository.findById(infoLibro.getEspecialidadId()).orElse(null));

        // Actualizar la información editorial
        EditorialDTO infoEditorial = dto.getInformacionEditorial();
        Editorial editorial = material.getEditorial();
        if (editorial == null) {
            editorial = new Editorial();
            editorial.setMaterialBibliografico(material);
            material.setEditorial(editorial);
        }
        editorial.setAutorPersonal(infoEditorial.getAutorPersonal());
        editorial.setAutorSecundario(infoEditorial.getAutorSecundario());
        editorial.setAutorInstitucional(infoEditorial.getAutorInstitucional());
        editorial.setEditorial(infoEditorial.getEditorial());
        editorial.setCoordinador(infoEditorial.getCoordinador());
        editorial.setDirector(infoEditorial.getDirector());
        editorial.setCompilador(infoEditorial.getCompilador());
        editorial.setSerie(infoEditorial.getSerie());
        // Para el campo descripción física, podrías realizar la conversión o recuperación necesaria:
        editorial.setDescripcionFisica(String.valueOf(infoEditorial.getDescripcionFisicaId()));
        editorial.setCantidad(infoEditorial.getCantidad());
        editorial.setAnioPublicacion(infoEditorial.getAnioPublicacion());
        editorial.setEdicion(infoEditorial.getEdicion());
        editorial.setReimpresion(infoEditorial.getReimpresion());
        editorial.setIsbn(infoEditorial.getIsbn());
        // Actualiza país, ciudad e idioma usando los repositorios correspondientes, si los tienes:
        // editorial.setPais(paisRepository.findById(infoEditorial.getPaisId()).orElse(null));
        // editorial.setCiudad(ciudadRepository.findById(infoEditorial.getCiudadId()).orElse(null));
        // editorial.setIdioma(idiomaRepository.findById(infoEditorial.getIdiomaId()).orElse(null));

        // Actualizar el detalle
        DetalleDTO infoDetalle = dto.getDetalle();
        if (material.getDetalles() == null || material.getDetalles().isEmpty()) {
            // Si no existe un detalle, lo creamos y lo agregamos
            Detalle nuevoDetalle = new Detalle();
            nuevoDetalle.setMaterialBibliografico(material);
            material.setDetalles(List.of(nuevoDetalle));
        }
        // Usamos el primer detalle de la lista (o adapta si manejas varios)
        Detalle detalle = material.getDetalles().get(0);
        // Si recibes la fecha como String, realiza la conversión a Date según sea necesario
        // detalle.setFechaIngreso(convertirFecha(infoDetalle.getFechaIngreso()));
        detalle.setCosto(infoDetalle.getCosto() != null ? new java.math.BigDecimal(infoDetalle.getCosto()) : null);
        detalle.setNumeroFactura(infoDetalle.getNumeroFactura());
        if (portada != null && !portada.isEmpty()) {
            String filename = fileStorageService.store(portada);
            detalle.setPortadaLibroImg("/uploads/recursos/" + filename);
        } else {
            detalle.setPortadaLibroImg(infoDetalle.getPortadaLibroImg());
        }
        // Actualiza la sede, tipoMaterial y tipoAdquisicion usando sus respectivos repositorios:
        // detalle.setSede(sedeRepository.findById(infoDetalle.getSedeId()).orElse(null));
//         detalle.setTipoMaterial(tipoMaterialRepository.findById(infoDetalle.getTipoMaterialId()).orElse(null));
        // detalle.setTipoAdquisicion(tipoAdquisicionRepository.findById(infoDetalle.getTipoAdquisicionId()).orElse(null));

        // Aquí podrías también actualizar datos de auditoría: fechaModificacion, usuarioModificacion, etc.

        return materialBibliograficoRepository.save(material);
    }


    public void delete(Long id) {
        materialBibliograficoRepository.deleteById(id);
    }

    // Obtener por ID
    public Optional<MaterialBibliografico> getById(Long id) {
        return materialBibliograficoRepository.findById(id);
    }

    public List<MaterialBibliografico> listAll() {
        return materialBibliograficoRepository.findAll(
                Sort.by(Sort.Direction.DESC, "id"));
    }


    public List<MaterialBibliografico> search(Integer tipoMaterialId, String opcion, String valor) {
        Specification<MaterialBibliografico> spec = Specification.where(null);

        // Filtrar por Tipo de Material si se envía
        if (tipoMaterialId != null) {
            spec = spec.and((root, query, cb) -> {
                // Realiza un join con la colección "detalles"
                Join<MaterialBibliografico, Detalle> detalleJoin = root.join("detalles");
                // Filtra por el id del tipoMaterial dentro del detalle
                return cb.equal(detalleJoin.get("tipoMaterial").get("id"), tipoMaterialId);
            });
        }


        // Si se filtra por algún campo
        if (opcion != null && !opcion.trim().isEmpty() && valor != null && !valor.trim().isEmpty()) {
            if (opcion.equalsIgnoreCase("editorial")) {
                // Realizamos un join con la entidad Editorial y filtramos por la propiedad "editorial" (o el nombre que uses)
                spec = spec.and((root, query, cb) -> {
                    Join<MaterialBibliografico, Editorial> editorialJoin = root.join("editorial");
                    return cb.like(cb.lower(editorialJoin.get("editorial").as(String.class)), "%" + valor.toLowerCase() + "%");
                });
            } else {
                // Para otros campos, si la propiedad es directa en MaterialBibliografico
                spec = spec.and((root, query, cb) ->
                        cb.like(
                                cb.lower(
                                        cb.function("TO_CHAR", String.class, root.get(opcion.toLowerCase()))
                                ),
                                "%" + valor.toLowerCase() + "%"
                        )
                );
            }
        }
        return materialBibliograficoRepository.findAll(spec,
                Sort.by(Sort.Direction.DESC, "id"));
    }

    public List<MaterialBibliografico> searchBySede(Long sedeId, String opcion, String valor) {
        Specification<MaterialBibliografico> spec = Specification.where(null);

        // Filtrar por Sede: Se realiza un join con "detalles" para acceder a la sede de cada detalle.
        if (sedeId != null) {
            spec = spec.and((root, query, cb) -> {
                // Se asume que 'detalles' es la colección asociada en MaterialBibliografico
                Join<MaterialBibliografico, Detalle> detalleJoin = root.join("detalles");
                // Se filtra por el id de la sede dentro de cada detalle
                return cb.equal(detalleJoin.get("sede").get("id"), sedeId);
            });
        }

        // Filtrado adicional si se envía opción y valor
        if (opcion != null && !opcion.trim().isEmpty() && valor != null && !valor.trim().isEmpty()) {
            if (opcion.equalsIgnoreCase("editorial")) {
                // Si se filtra por editorial, se realiza un join adicional con la entidad Editorial
                spec = spec.and((root, query, cb) -> {
                    Join<MaterialBibliografico, Editorial> editorialJoin = root.join("editorial");
                    return cb.like(cb.lower(editorialJoin.get("editorial").as(String.class)),
                            "%" + valor.toLowerCase() + "%");
                });
            } else {
                // Para otros campos que sean propiedades directas en MaterialBibliografico
                spec = spec.and((root, query, cb) ->
                        cb.like(
                                cb.lower(
                                        cb.function("TO_CHAR", String.class, root.get(opcion.toLowerCase()))
                                ),
                                "%" + valor.toLowerCase() + "%"
                        )
                );
            }
        }
        return materialBibliograficoRepository.findAll(spec,
                Sort.by(Sort.Direction.DESC, "id"));
    }



//
//    public MaterialBibliografico changeState(Long id, String estado, String usuarioModificacion) {
//        Optional<MaterialBibliografico> optional = repository.findById(id);
//        if(optional.isPresent()){
//            MaterialBibliografico material = optional.get();
//            material.setEstado(estado);
//            material.setUsuarioModificacion(usuarioModificacion);
//            material.setFechaModificacion(new Date());
//            return repository.save(material);
//        }
//        throw new RuntimeException("Material no encontrado con id: " + id);
//    }
}

