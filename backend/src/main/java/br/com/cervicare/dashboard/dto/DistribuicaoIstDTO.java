package br.com.cervicare.dashboard.dto;

import lombok.Builder;

@Builder
public record DistribuicaoIstDTO(
        String ist,
        Long quantidade
) {}