package br.com.colpocare.historico.dto;

import br.com.colpocare.historico.domain.enums.StatusFumante;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record HistoricoTabagismoRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @PositiveOrZero
        Integer cigarrosDia,

        @PositiveOrZero
        Integer idadeInicio,

        @PositiveOrZero
        Integer idadeFim,

        @NotNull(message = "O status de fumante é obrigatório")
        StatusFumante fumante
) {}