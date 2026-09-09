package br.com.cervicare.historico.dto;

import br.com.cervicare.historico.domain.enums.MetodoContraceptivo;
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