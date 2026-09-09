package br.com.cervicare.historico.dto;

import br.com.cervicare.historico.domain.enums.MetodoContraceptivo;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record SaudeSexualRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A sexarca é obrigatória")
        @PositiveOrZero
        Integer sexarca,

        @NotNull(message = "O método contraceptivo (MAC) é obrigatório")
        MetodoContraceptivo mac,

        @NotNull(message = "O número de parceiros é obrigatório")
        @PositiveOrZero
        Integer numParceiros,

        @NotNull(message = "A informação de VVS é obrigatória")
        Boolean vvs
) {}