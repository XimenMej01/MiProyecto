package com.bancosemillas.service;

import com.bancosemillas.dto.EstadisticasResponse;
import com.bancosemillas.dto.SemillaRequest;
import com.bancosemillas.entity.Semilla;
import com.bancosemillas.exception.BusinessException;
import com.bancosemillas.repository.SemillaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class SemillaService {
    private final SemillaRepository repository;

    public SemillaService(SemillaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Semilla> listar() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }

    @Transactional(readOnly = true)
    public Semilla buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontro la semilla solicitada"));
    }

    public Semilla registrar(SemillaRequest request) {
        validarFecha(request.fechaRegistro());
        String nombre = limpiar(request.nombre());
        String variedad = limpiar(request.variedad());
        String categoria = limpiar(request.categoria());
        validarCategoria(categoria);
        validarDuplicado(nombre, variedad, categoria, null);

        Semilla semilla = new Semilla(
                nombre,
                variedad,
                categoria,
                request.cantidad(),
                limpiar(request.procedencia()),
                request.fechaRegistro(),
                limpiarOpcional(request.descripcion())
        );
        return repository.save(semilla);
    }

    public Semilla actualizar(Long id, SemillaRequest request) {
        Semilla existente = buscarPorId(id);
        String nombre = limpiar(request.nombre());
        String variedad = limpiar(request.variedad());
        String categoria = limpiar(request.categoria());
        validarCategoria(categoria);
        validarDuplicado(nombre, variedad, categoria, id);

        existente.setNombre(nombre);
        existente.setVariedad(variedad);
        existente.setCategoria(categoria);
        existente.setCantidad(request.cantidad());
        existente.setProcedencia(limpiar(request.procedencia()));
        existente.setDescripcion(limpiarOpcional(request.descripcion()));
        // Se conserva la fecha original de registro al editar otros datos.
        return repository.save(existente);
    }

    public void eliminar(Long id) {
        Semilla existente = buscarPorId(id);
        repository.delete(existente);
    }

    @Transactional(readOnly = true)
    public EstadisticasResponse obtenerEstadisticas() {
        long total = repository.count();
        long disponibles = repository.countByCantidadGreaterThan(BigDecimal.ZERO);
        long agotadas = repository.countByCantidad(BigDecimal.ZERO);
        long categorias = repository.contarCategorias();
        return new EstadisticasResponse(total, disponibles, agotadas, categorias);
    }

    private void validarCategoria(String categoria) {
        List<String> categoriasPermitidas = List.of(
                "Hortaliza", "Frutal", "Medicinal", "Ornamental", "Leguminosa", "Cereal");
        boolean permitida = categoriasPermitidas.stream().anyMatch(c -> c.equalsIgnoreCase(categoria));
        if (!permitida) {
            throw new BusinessException("Seleccione una categoria valida");
        }
    }

    private void validarDuplicado(String nombre, String variedad, String categoria, Long idActual) {
        boolean existe = idActual == null
                ? repository.existsByNombreIgnoreCaseAndVariedadIgnoreCaseAndCategoriaIgnoreCase(nombre, variedad, categoria)
                : repository.existsByNombreIgnoreCaseAndVariedadIgnoreCaseAndCategoriaIgnoreCaseAndIdNot(nombre, variedad, categoria, idActual);
        if (existe) {
            throw new BusinessException("Esta variedad ya se encuentra registrada en esa categoria");
        }
    }

    private void validarFecha(LocalDate fecha) {
        if (fecha.isAfter(LocalDate.now())) {
            throw new BusinessException("La fecha de registro no puede ser futura");
        }
    }

    private String limpiar(String valor) {
        return valor == null ? "" : valor.trim().replaceAll("\\s+", " ");
    }

    private String limpiarOpcional(String valor) {
        String limpio = limpiar(valor);
        return limpio.isBlank() ? null : limpio;
    }
}
