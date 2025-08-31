package com.miapp.repository;

import com.miapp.model.OcurrenciaMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OcurrenciaMaterialRepository extends JpaRepository<OcurrenciaMaterial, Long> {
    List<OcurrenciaMaterial> findByIdocurrencia(Long idocurrencia);
    // Devuelve el registro para el “material original” (si ya existe) dado el idOcurrencia y el idEquipoLaboratorio
    Optional<OcurrenciaMaterial> findByIdocurrenciaAndIdEquipoLaboratorio(Long idOcurrencia, Long idEquipoLaboratorio);
    /** Indica si la ocurrencia contiene al menos un material de laboratorio */
    boolean existsByIdocurrenciaAndEsBibliotecaFalse(Long idocurrencia);

    /** Indica si la ocurrencia contiene al menos un material bibliográfico */
    boolean existsByIdocurrenciaAndEsBibliotecaTrue(Long idocurrencia);
    @Query("select coalesce(sum(m.costoUnitario * m.cantidad),0) from OcurrenciaMaterial m where m.idocurrencia = :id")
    BigDecimal sumCostoByOcurrencia(@Param("id") Long id);
}
