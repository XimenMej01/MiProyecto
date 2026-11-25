package com.bancosemillas.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SemillaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
        @Pattern(regexp = "[\\p{L}\\p{M}\\s'-]+", message = "El nombre solo puede contener letras y espacios")
        String nombre,

        @NotBlank(message = "La variedad es obligatoria")
        @Size(min = 2, max = 100, message = "La variedad debe tener entre 2 y 100 caracteres")
        String variedad,

        @NotBlank(message = "La categoria es obligatoria")
        @Size(max = 50, message = "La categoria no puede superar 50 caracteres")
        String categoria,

        @NotNull(message = "La cantidad es obligatoria")
        @DecimalMin(value = "0.0", message = "La cantidad no puede ser negativa")
        @Digits(integer = 8, fraction = 2, message = "La cantidad admite hasta 8 enteros y 2 decimales")
        BigDecimal cantidad,

        @NotBlank(message = "La procedencia es obligatoria")
        @Size(min = 3, max = 150, message = "La procedencia debe tener entre 3 y 150 caracteres")
        String procedencia,

        @NotNull(message = "La fecha de registro es obligatoria")
        LocalDate fechaRegistro,

        @Size(max = 500, message = "La descripcion no puede superar 500 caracteres")
        String descripcion
) {}
