package br.com.cervicare.historico.dto;

import br.com.cervicare.historico.domain.enums.TipoIst;
import jakarta.validation.constraints.NotNull;

public record HistoricoIstRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "O tipo da IST é obrigatório")
        TipoIst ist,

        Boolean condilomaHpv
) {}