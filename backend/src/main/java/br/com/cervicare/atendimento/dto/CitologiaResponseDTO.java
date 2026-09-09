package br.com.cervicare.atendimento.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record CitologiaResponseDTO(
        Integer idExame,
        Integer idPaciente,
        String nomePaciente,
        String nomeMedico,
        LocalDate dataRegistro,
        String resultado,
        String observacao,
        LocalDateTime dataEdicao
) {}