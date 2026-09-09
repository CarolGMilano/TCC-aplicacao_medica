package br.com.cervicare.historico.controller;

import br.com.cervicare.historico.dto.DadosGinecoObstetricosRequestDTO;
import br.com.cervicare.historico.dto.DadosGinecoObstetricosResponseDTO;
import br.com.cervicare.historico.service.DadosGinecoObstetricosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico/gineco-obstetrico")
@RequiredArgsConstructor
public class DadosGinecoObstetricosController {

    private final DadosGinecoObstetricosService service;

    @PostMapping
    public ResponseEntity<DadosGinecoObstetricosResponseDTO> registrar(
            @RequestBody @Valid DadosGinecoObstetricosRequestDTO dto
    ) {
        DadosGinecoObstetricosResponseDTO novosDados = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novosDados);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<DadosGinecoObstetricosResponseDTO>> listarPorPaciente(
            @PathVariable Integer idPaciente
    ) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }
}