package br.com.cervicare.historico.controller;

import br.com.cervicare.historico.dto.HistoricoIstRequestDTO;
import br.com.cervicare.historico.dto.HistoricoIstResponseDTO;
import br.com.cervicare.historico.service.HistoricoIstService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico/ist")
@RequiredArgsConstructor
public class HistoricoIstController {

    private final HistoricoIstService service;

    @PostMapping
    public ResponseEntity<HistoricoIstResponseDTO> registrar(
            @RequestBody @Valid HistoricoIstRequestDTO dto
    ) {
        HistoricoIstResponseDTO novoIst = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoIst);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<HistoricoIstResponseDTO>> listarPorPaciente(
            @PathVariable Integer idPaciente
    ) {
        return ResponseEntity.ok(service.listarPorPaciente(idPaciente));
    }
}