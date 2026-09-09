package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ClassificacaoColposcopia;
import br.com.cervicare.atendimento.domain.enums.GrauLesao;
import br.com.cervicare.atendimento.domain.enums.ZonaTransformacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ColposcopiaRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório")
        Integer idPaciente,

        @NotNull(message = "A data do registro é obrigatória")
        LocalDate dataRegistro,

        @NotNull(message = "A informação de estrogenização é obrigatória")
        Boolean estrogenizacao,

        @NotBlank(message = "A JEC é obrigatória")
        String jec,

        @NotNull(message = "A Zona de Transformação é obrigatória")
        ZonaTransformacao zt,

        Boolean lesao,
        
        Boolean recidiva,
        
        GrauLesao grauLesao,
        
        ClassificacaoColposcopia classificacao,
        
        String observacao,

        @NotNull(message = "A indicação de ver e tratar é obrigatória")
        Boolean verETratar,
        
        String verETratarMotivo
) {}