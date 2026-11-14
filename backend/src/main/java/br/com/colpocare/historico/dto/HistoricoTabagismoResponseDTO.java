package br.com.colpocare.historico.dto;

import br.com.colpocare.historico.domain.enums.StatusFumante;
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