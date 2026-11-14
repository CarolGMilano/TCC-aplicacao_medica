package br.com.colpocare.historico.dto;

import br.com.colpocare.historico.domain.enums.TipoIst;
import jakarta.validation.constraints.NotNull;

public record HistoricoIstRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "O tipo da IST é obrigatório")
        TipoIst ist,

        Boolean condilomaHpv
) {}