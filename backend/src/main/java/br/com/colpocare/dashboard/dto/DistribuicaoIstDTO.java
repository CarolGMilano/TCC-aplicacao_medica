package br.com.colpocare.dashboard.dto;

import lombok.Builder;

@Builder
public record DistribuicaoIstDTO(
        String ist,
        Long quantidade
) {}