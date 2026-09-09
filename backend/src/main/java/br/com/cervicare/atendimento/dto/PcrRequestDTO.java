package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ResultadoPcr;
import br.com.cervicare.atendimento.domain.enums.TipoHpv;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PcrRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        LocalDate dataRegistro,

        @NotNull(message = "O resultado do PCR é obrigatório")
        ResultadoPcr resultado,

        TipoHpv tipoHpv,

        String observacao
) {}