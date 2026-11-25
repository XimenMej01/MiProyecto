package com.bancosemillas.service;

import com.bancosemillas.dto.LoginRequest;
import com.bancosemillas.dto.LoginResponse;
import com.bancosemillas.entity.Usuario;
import com.bancosemillas.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(request.correo().trim())
                .orElseThrow(() -> new BadCredentialsException("Credenciales incorrectas"));

        if (!usuario.isActivo() || !passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new BadCredentialsException("Credenciales incorrectas");
        }

        return new LoginResponse(jwtService.generarToken(usuario.getCorreo()), usuario.getNombre(), usuario.getCorreo());
    }
}
