package com.bancosemillas.config;

import com.bancosemillas.entity.Semilla;
import com.bancosemillas.entity.Usuario;
import com.bancosemillas.repository.SemillaRepository;
import com.bancosemillas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner cargarDatosIniciales(UsuarioRepository usuarios,
                                           SemillaRepository semillas,
                                           PasswordEncoder encoder) {
        return args -> {
            if (!usuarios.existsByCorreoIgnoreCase("admin@bancosemillas.local")) {
                usuarios.save(new Usuario(
                        "Administrador", "admin@bancosemillas.local",
                        encoder.encode("Semillas2026!"), true));
            }

            if (semillas.count() == 0) {
                semillas.saveAll(List.of(
                        new Semilla("Tomate", "Cherry", "Hortaliza", new BigDecimal("500.00"), "Chiclayo", LocalDate.now().minusDays(8), "Semillas para cultivo comunitario."),
                        new Semilla("Zanahoria", "Nantes", "Hortaliza", new BigDecimal("0.00"), "Lambayeque", LocalDate.now().minusDays(6), "Variedad de raiz."),
                        new Semilla("Albahaca", "Genovesa", "Medicinal", new BigDecimal("250.00"), "Pimentel", LocalDate.now().minusDays(4), "Planta aromatica."),
                        new Semilla("Papaya", "Maradol", "Frutal", new BigDecimal("120.00"), "Ferreñafe", LocalDate.now().minusDays(2), "Semillas de fruto tropical.")
                ));
            }
        };
    }
}
