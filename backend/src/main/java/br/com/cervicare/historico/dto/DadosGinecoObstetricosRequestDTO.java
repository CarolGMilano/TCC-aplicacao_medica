package br.com.cervicare.historico.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DadosGinecoObstetricosRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "O número de gestações é obrigatório")
        @PositiveOrZero
        Integer numGestacao,

        @NotNull(message = "O número de partos normais é obrigatório")
        @PositiveOrZero
        Integer numPartoNormal,

        @NotNull(message = "O número de cesarianas é obrigatório")
        @PositiveOrZero
        Integer numCesariana,

        @NotNull(message = "O número de abortos é obrigatório")
        @PositiveOrZero
        Integer numAborto,

        @NotNull(message = "A idade da menarca é obrigatória")
        @PositiveOrZero
        Integer menarca,

        @PositiveOrZero
        Integer menopausa
) {}