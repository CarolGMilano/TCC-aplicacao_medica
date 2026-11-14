package br.com.colpocare.historico.dto;

import br.com.colpocare.historico.domain.enums.TipoIst;
import lombok.Builder;

@Builder
public record HistoricoIstResponseDTO(
        Integer idHistorico,
        Integer idPaciente,
        TipoIst ist,
        Boolean condilomaHpv
) {}