package br.com.cervicare.medico.controller;

import br.com.cervicare.auth.domain.enums.TipoUsuario;
import br.com.cervicare.medico.dto.MedicoRequestDTO;
import br.com.cervicare.medico.dto.MedicoResponseDTO;
import br.com.cervicare.medico.service.MedicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profissionais")
@RequiredArgsConstructor
public class MedicoController {

    private final MedicoService service;

    @GetMapping
    public ResponseEntity<Page<MedicoResponseDTO>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) TipoUsuario tipo,
            @PageableDefault(size = 20, sort = "nome") Pageable pageable
    ) {
        return ResponseEntity.ok(service.listar(busca, especialidade, tipo, pageable));
    }

    @PostMapping
    public ResponseEntity<MedicoResponseDTO> cadastrar(@RequestBody @Valid MedicoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicoResponseDTO> atualizar(@PathVariable Integer id, @RequestBody @Valid MedicoRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Integer id) {
        service.inativar(id);
        return ResponseEntity.noContent().build();
    }
}