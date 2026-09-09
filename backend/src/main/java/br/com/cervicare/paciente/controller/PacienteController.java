package br.com.cervicare.paciente.controller;

import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import br.com.cervicare.paciente.dto.PacienteRequestDTO;
import br.com.cervicare.paciente.dto.PacienteResponseDTO;
import br.com.cervicare.paciente.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;

    @GetMapping
    public ResponseEntity<Page<PacienteResponseDTO>> listarPacientes(

            @RequestParam(required = false)
            String busca,

            @RequestParam(required = false)
            StatusPaciente status,

            @PageableDefault(
                    size = 20,
                    sort = "nome",
                    direction = Sort.Direction.ASC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                service.listar(
                        busca,
                        status,
                        pageable
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPaciente(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
                service.buscarPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> cadastrarPaciente(
            @RequestBody @Valid PacienteRequestDTO dto
    ) {
        PacienteResponseDTO paciente =
                service.cadastrar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> atualizarPaciente(
            @PathVariable Integer id,
            @RequestBody @Valid PacienteRequestDTO dto
    ) {
        return ResponseEntity.ok(
                service.atualizar(id, dto)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PacienteResponseDTO> atualizarStatus(
            @PathVariable Integer id,
            @RequestParam StatusPaciente status
    ) {
        return ResponseEntity.ok(
                service.atualizarStatus(id, status)
        );
    }
}