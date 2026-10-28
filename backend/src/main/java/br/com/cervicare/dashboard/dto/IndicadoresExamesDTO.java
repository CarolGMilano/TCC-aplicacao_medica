package br.com.cervicare.dashboard.dto;

import lombok.Builder;

import java.util.List;

// Aba "Exames" do dashboard mobile: indicadores do mês informado.
@Builder
public record IndicadoresExamesDTO(
        String mes,
        Long examesNoMes,
        Long examesMesAnterior,
        Double variacaoPercentual,
        List<ResultadoQuantidadeDTO> citologiaPorResultado,
        PcrPorResultadoDTO pcrPorResultado,
        Long verETratarRealizados
) {}
