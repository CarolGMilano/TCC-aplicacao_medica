package br.com.cervicare.atendimento.controller;

import br.com.cervicare.atendimento.dto.CitologiaRequestDTO;
import br.com.cervicare.atendimento.dto.CitologiaResponseDTO;
import br.com.cervicare.atendimento.service.CitologiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citologias")
@RequiredArgsConstructor
public class CitologiaController {

    private final CitologiaService service;

    @PostMapping
    public ResponseEntity<CitologiaResponseDTO> registrar(@RequestBody @Valid CitologiaRequestDTO dto) {
        CitologiaResponseDTO novaCitologia = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCitologia);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<CitologiaResponseDTO>> listarPorPaciente(@PathVariable Integer idPaciente) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CitologiaResponseDTO> atualizar(@PathVariable Integer id, @RequestBody @Valid CitologiaRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}