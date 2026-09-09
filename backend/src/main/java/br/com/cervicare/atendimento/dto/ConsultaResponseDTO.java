package br.com.cervicare.atendimento.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ConsultaResponseDTO(
        Integer idConsulta,
        Integer idPaciente,
        String nomePaciente,
        String nomeMedico,
        LocalDateTime dataHora,
        String observacao
) {}