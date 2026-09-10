package br.com.cervicare.medico.controller;

import br.com.cervicare.medico.dto.MedicoResponseDTO;
import br.com.cervicare.medico.dto.PerfilNomeRequestDTO;
import br.com.cervicare.medico.service.MedicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final MedicoService service;

    @GetMapping
    public ResponseEntity<MedicoResponseDTO> obterPerfil() {
        return ResponseEntity.ok(service.obterPerfilLogado());
    }

    @PutMapping("/nome")
    public ResponseEntity<MedicoResponseDTO> atualizarNome(@RequestBody @Valid PerfilNomeRequestDTO dto) {
        return ResponseEntity.ok(service.atualizarNomePerfil(dto.nome()));
    }
}