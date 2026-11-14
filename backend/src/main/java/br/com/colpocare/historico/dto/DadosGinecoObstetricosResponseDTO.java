package br.com.colpocare.historico.dto;

import lombok.Builder;

@Builder
public record DadosGinecoObstetricosResponseDTO(
        Integer idDados,
        Integer idPaciente,
        Integer numGestacao,
        Integer numPartoNormal,
        Integer numCesariana,
        Integer numAborto,
        Integer menarca,
        Integer menopausa
) {}