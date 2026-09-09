package br.com.cervicare.historico.dto;

import br.com.cervicare.historico.domain.enums.TipoIst;
import lombok.Builder;

@Builder
public record HistoricoIstResponseDTO(
        Integer idHistorico,
        Integer idPaciente,
        TipoIst ist,
        Boolean condilomaHpv
) {}