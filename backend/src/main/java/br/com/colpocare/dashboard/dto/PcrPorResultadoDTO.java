package br.com.colpocare.dashboard.dto;

import lombok.Builder;

@Builder
public record PcrPorResultadoDTO(
        Long negativo,
        Long hpv16ou18,
        Long outros
) {}
