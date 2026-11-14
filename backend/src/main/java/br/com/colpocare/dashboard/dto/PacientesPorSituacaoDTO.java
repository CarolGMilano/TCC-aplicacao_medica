package br.com.colpocare.dashboard.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record PacientesPorSituacaoDTO(
        Long total,
        List<SituacaoQuantidadeDTO> situacoes
) {}
