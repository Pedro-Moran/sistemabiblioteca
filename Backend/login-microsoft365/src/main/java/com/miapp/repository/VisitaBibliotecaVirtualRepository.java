package com.miapp.repository;

import com.miapp.model.VisitaBibliotecaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VisitaBibliotecaVirtualRepository extends JpaRepository<VisitaBibliotecaVirtual, Long> {

    @Query("select coalesce(max(v.id), 0) from VisitaBibliotecaVirtual v")
    Long findMaxId();
}
