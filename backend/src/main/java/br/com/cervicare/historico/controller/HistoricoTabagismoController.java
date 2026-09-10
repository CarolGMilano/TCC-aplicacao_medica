package br.com.cervicare.historico.controller;

import br.com.cervicare.historico.dto.HistoricoTabagismoRequestDTO;
import br.com.cervicare.historico.dto.HistoricoTabagismoResponseDTO;
import br.com.cervicare.historico.service.HistoricoTabagismoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico/tabagismo")
@RequiredArgsConstructor
public class HistoricoTabagismoController {

    private final HistoricoTabagismoService service;

    @PostMapping
    public ResponseEntity<HistoricoTabagismoResponseDTO> registrar(@RequestBody @Valid HistoricoTabagismoRequestDTO dto) {
        HistoricoTabagismoResponseDTO novoHistorico = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoHistorico);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<HistoricoTabagismoResponseDTO>> listarPorPaciente(@PathVariable Integer idPaciente) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoTabagismoResponseDTO> atualizar(@PathVariable Integer id, @RequestBody @Valid HistoricoTabagismoRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}