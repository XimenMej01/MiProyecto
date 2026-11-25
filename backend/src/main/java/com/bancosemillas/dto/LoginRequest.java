package com.bancosemillas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Ingrese un correo valido")
        String correo,
        @NotBlank(message = "La contrasena es obligatoria")
        String password
) {}
