package br.com.cervicare.atendimento.controller;

import br.com.cervicare.atendimento.dto.PcrRequestDTO;
import br.com.cervicare.atendimento.dto.PcrResponseDTO;
import br.com.cervicare.atendimento.service.PcrService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pcr")
@RequiredArgsConstructor
public class PcrController {

    private final PcrService service;

    @PostMapping
    public ResponseEntity<PcrResponseDTO> registrar(@RequestBody @Valid PcrRequestDTO dto) {
        PcrResponseDTO novoPcr = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPcr);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<PcrResponseDTO>> listarPorPaciente(@PathVariable Integer idPaciente) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PcrResponseDTO> atualizar(@PathVariable Integer id, @RequestBody @Valid PcrRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}