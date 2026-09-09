package br.com.cervicare.atendimento.controller;

import br.com.cervicare.atendimento.dto.ConsultaRequestDTO;
import br.com.cervicare.atendimento.dto.ConsultaResponseDTO;
import br.com.cervicare.atendimento.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService service;

    @PostMapping
    public ResponseEntity<ConsultaResponseDTO> registrar(
            @RequestBody @Valid ConsultaRequestDTO dto
    ) {
        ConsultaResponseDTO novaConsulta = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaConsulta);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ConsultaResponseDTO>> listarPorPaciente(
            @PathVariable Integer idPaciente
    ) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }
}