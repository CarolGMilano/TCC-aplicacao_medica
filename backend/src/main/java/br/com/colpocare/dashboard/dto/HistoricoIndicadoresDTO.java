package br.com.colpocare.dashboard.dto;

import lombok.Builder;

@Builder
public record HistoricoIndicadoresDTO(
        Long totalColposcopias,
        Long indicacoesVerETratar,
        Double percentualVerETratar,
        Long pacientesComRecidiva,
        Long pacientesSemRecidiva,
        Double percentualRecidiva
) {}