package br.com.cervicare.dashboard.dto;

import lombok.Builder;

@Builder
public record DistribuicaoEtariaDTO(
        String faixa,
        Long quantidade,
        Boolean prioritario
) {}