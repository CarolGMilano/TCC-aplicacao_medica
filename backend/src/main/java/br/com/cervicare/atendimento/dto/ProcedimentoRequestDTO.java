package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.Margem;
import br.com.cervicare.atendimento.domain.enums.ResultadoProcedimento;
import br.com.cervicare.atendimento.domain.enums.TipoProcedimento;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

public record ProcedimentoRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        @PastOrPresent(message = "A data do registro não pode ser no futuro")
        LocalDate dataRegistro,

        @NotNull(message = "O tipo do procedimento é obrigatório")
        TipoProcedimento tipo,

        @NotNull(message = "A quantidade de fragmentos é obrigatória")
        @Min(value = 1, message = "Informe ao menos 1 fragmento")
        @Max(value = 20, message = "A quantidade de fragmentos deve ser no máximo 20")
        Integer qtFragmento,

        Margem margemEndocervical,
        
        Margem margemEctocervical,

        @NotNull(message = "O resultado é obrigatório")
        ResultadoProcedimento resultado,

        String observacao
) {}