package br.com.cervicare.auth.controller;

import br.com.cervicare.auth.domain.Usuario;
import br.com.cervicare.auth.dto.AlterarSenhaRequestDTO;
import br.com.cervicare.auth.dto.LoginRequestDTO;
import br.com.cervicare.auth.dto.TokenResponseDTO;
import br.com.cervicare.auth.service.TokenService;
import br.com.cervicare.auth.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid LoginRequestDTO data) {
        var authToken = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var authentication = authenticationManager.authenticate(authToken);
        
        var usuario = (Usuario) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new TokenResponseDTO(tokenJWT, "Bearer"));
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<Void> alterarSenha(@RequestBody @Valid AlterarSenhaRequestDTO dto) {
        usuarioService.alterarSenha(dto);
        return ResponseEntity.noContent().build();
    }
}