package br.com.cervicare.atendimento.controller;

import br.com.cervicare.atendimento.dto.ColposcopiaRequestDTO;
import br.com.cervicare.atendimento.dto.ColposcopiaResponseDTO;
import br.com.cervicare.atendimento.service.ColposcopiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colposcopias")
@RequiredArgsConstructor
public class ColposcopiaController {

    private final ColposcopiaService service;

    @PostMapping
    public ResponseEntity<ColposcopiaResponseDTO> registrar(
            @RequestBody @Valid ColposcopiaRequestDTO dto
    ) {
        ColposcopiaResponseDTO novaColposcopia = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaColposcopia);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ColposcopiaResponseDTO>> listarPorPaciente(
            @PathVariable Integer idPaciente
    ) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }
}