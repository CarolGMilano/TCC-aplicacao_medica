package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ResultadoPcr;
import br.com.cervicare.atendimento.domain.enums.TipoHpv;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.util.List;

public record PcrRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        @PastOrPresent(message = "A data do registro não pode ser no futuro")
        LocalDate dataRegistro,

        @NotNull(message = "O resultado do PCR é obrigatório")
        ResultadoPcr resultado,

        List<TipoHpv> tiposHpv,

        String observacao
) {}