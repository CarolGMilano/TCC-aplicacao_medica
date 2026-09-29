package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ResultadoCitologia;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CitologiaRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        LocalDate dataRegistro,

        @NotNull(message = "O resultado é obrigatório")
        ResultadoCitologia resultado,

        String observacao
) {}