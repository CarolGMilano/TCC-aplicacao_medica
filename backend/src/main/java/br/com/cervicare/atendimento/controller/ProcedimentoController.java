package br.com.cervicare.atendimento.controller;

import br.com.cervicare.atendimento.dto.ProcedimentoRequestDTO;
import br.com.cervicare.atendimento.dto.ProcedimentoResponseDTO;
import br.com.cervicare.atendimento.service.ProcedimentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedimentos")
@RequiredArgsConstructor
public class ProcedimentoController {

    private final ProcedimentoService service;

    @PostMapping
    public ResponseEntity<ProcedimentoResponseDTO> registrar(
            @RequestBody @Valid ProcedimentoRequestDTO dto
    ) {
        ProcedimentoResponseDTO novoProcedimento = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProcedimento);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ProcedimentoResponseDTO>> listarPorPaciente(
            @PathVariable Integer idPaciente
    ) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }
}