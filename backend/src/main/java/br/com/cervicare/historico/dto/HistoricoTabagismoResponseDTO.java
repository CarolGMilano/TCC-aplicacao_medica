package br.com.cervicare.historico.dto;

import br.com.cervicare.historico.domain.enums.StatusFumante;
import lombok.Builder;

@Builder
public record HistoricoTabagismoResponseDTO(
        Integer idHistorico,
        Integer idPaciente,
        Integer cigarrosDia,
        Integer idadeInicio,
        Integer idadeFim,
        StatusFumante fumante
) {}