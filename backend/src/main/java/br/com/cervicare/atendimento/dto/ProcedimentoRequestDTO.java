package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.Margem;
import br.com.cervicare.atendimento.domain.enums.ResultadoProcedimento;
import br.com.cervicare.atendimento.domain.enums.TipoProcedimento;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ProcedimentoRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        LocalDate dataRegistro,

        @NotNull(message = "O tipo do procedimento é obrigatório")
        TipoProcedimento tipo,

        @NotNull(message = "A quantidade de fragmentos é obrigatória")
        Integer qtFragmento,

        Margem margemEndocervical,
        
        Margem margemEctocervical,

        @NotNull(message = "O resultado é obrigatório")
        ResultadoProcedimento resultado,

        String observacao
) {}