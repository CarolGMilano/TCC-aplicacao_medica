package br.com.colpocare.atendimento.dto;

import br.com.colpocare.atendimento.domain.enums.Margem;
import br.com.colpocare.atendimento.domain.enums.ResultadoProcedimento;
import br.com.colpocare.atendimento.domain.enums.TipoProcedimento;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record ProcedimentoResponseDTO(
        Integer idProcedimento,
        Integer idPaciente,
        String nomePaciente,
        String nomeMedico,
        LocalDate dataRegistro,
        TipoProcedimento tipo,
        Integer qtFragmento,
        Margem margemEndocervical,
        Margem margemEctocervical,
        ResultadoProcedimento resultado,
        String observacao,
        LocalDateTime dataEdicao
) {}