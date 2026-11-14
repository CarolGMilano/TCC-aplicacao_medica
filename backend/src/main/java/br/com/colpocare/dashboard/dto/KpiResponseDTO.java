package br.com.colpocare.dashboard.dto;

import lombok.Builder;

@Builder
public record KpiResponseDTO(
        Long totalPacientes,
        Long totalProfissionais,
        Long totalRegistros
) {}