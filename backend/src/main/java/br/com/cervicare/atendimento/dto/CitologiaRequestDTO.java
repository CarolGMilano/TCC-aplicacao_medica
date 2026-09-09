package br.com.cervicare.atendimento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CitologiaRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        LocalDate dataRegistro,

        @NotBlank(message = "O resultado é obrigatório")
        String resultado,

        String observacao
) {}