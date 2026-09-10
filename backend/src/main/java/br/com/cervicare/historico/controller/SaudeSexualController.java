package br.com.cervicare.historico.controller;

import br.com.cervicare.historico.dto.SaudeSexualRequestDTO;
import br.com.cervicare.historico.dto.SaudeSexualResponseDTO;
import br.com.cervicare.historico.service.SaudeSexualService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico/saude-sexual")
@RequiredArgsConstructor
public class SaudeSexualController {

    private final SaudeSexualService service;

    @PostMapping
    public ResponseEntity<SaudeSexualResponseDTO> registrar(@RequestBody @Valid SaudeSexualRequestDTO dto) {
        SaudeSexualResponseDTO novaSaude = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaSaude);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<SaudeSexualResponseDTO>> listarPorPaciente(@PathVariable Integer idPaciente) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaudeSexualResponseDTO> atualizar(@PathVariable Integer id, @RequestBody @Valid SaudeSexualRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}