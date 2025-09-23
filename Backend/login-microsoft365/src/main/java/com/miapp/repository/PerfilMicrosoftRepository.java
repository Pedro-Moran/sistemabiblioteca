package com.miapp.repository;

import com.miapp.model.PerfilMicrosoft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PerfilMicrosoftRepository extends JpaRepository<PerfilMicrosoft, String> {

    @Query("SELECT p FROM PerfilMicrosoft p WHERE UPPER(p.graphGroupId) IN :graphGroupIds")
    List<PerfilMicrosoft> findByGraphGroupIdInIgnoreCase(@Param("graphGroupIds") Collection<String> graphGroupIds);
}