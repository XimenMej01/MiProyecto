package com.bancosemillas.controller;

import com.bancosemillas.dto.EstadisticasResponse;
import com.bancosemillas.dto.SemillaRequest;
import com.bancosemillas.entity.Semilla;
import com.bancosemillas.service.SemillaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semillas")
public class SemillaController {
    private final SemillaService semillaService;

    public SemillaController(SemillaService semillaService) {
        this.semillaService = semillaService;
    }

    @GetMapping
    public List<Semilla> listar() {
        return semillaService.listar();
    }

    @GetMapping("/estadisticas")
    public EstadisticasResponse estadisticas() {
        return semillaService.obtenerEstadisticas();
    }

    @GetMapping("/{id}")
    public Semilla buscar(@PathVariable Long id) {
        return semillaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Semilla> registrar(@Valid @RequestBody SemillaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(semillaService.registrar(request));
    }

    @PutMapping("/{id}")
    public Semilla actualizar(@PathVariable Long id, @Valid @RequestBody SemillaRequest request) {
        return semillaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        semillaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
