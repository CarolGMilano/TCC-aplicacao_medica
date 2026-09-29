package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ResultadoCitologia;
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
        ResultadoCitologia resultado,
        String observacao,
        LocalDateTime dataEdicao
) {}