package com.bancosemillas.repository;

import com.bancosemillas.entity.Semilla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;

public interface SemillaRepository extends JpaRepository<Semilla, Long> {
    boolean existsByNombreIgnoreCaseAndVariedadIgnoreCaseAndCategoriaIgnoreCase(
            String nombre, String variedad, String categoria);

    boolean existsByNombreIgnoreCaseAndVariedadIgnoreCaseAndCategoriaIgnoreCaseAndIdNot(
            String nombre, String variedad, String categoria, Long id);

    long countByCantidadGreaterThan(BigDecimal cantidad);
    long countByCantidad(BigDecimal cantidad);

    @Query("select count(distinct lower(s.categoria)) from Semilla s")
    long contarCategorias();
}
