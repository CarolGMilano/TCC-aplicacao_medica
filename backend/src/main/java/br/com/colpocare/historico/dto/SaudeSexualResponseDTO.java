package br.com.colpocare.historico.dto;

import br.com.colpocare.historico.domain.enums.MetodoContraceptivo;
import lombok.Builder;

@Builder
public record SaudeSexualResponseDTO(
        Integer idDados,
        Integer idPaciente,
        Integer sexarca,
        MetodoContraceptivo mac,
        Integer numParceiros,
        Boolean vvs
) {}