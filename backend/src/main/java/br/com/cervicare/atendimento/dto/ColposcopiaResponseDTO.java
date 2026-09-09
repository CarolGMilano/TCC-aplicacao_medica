package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ClassificacaoColposcopia;
import br.com.cervicare.atendimento.domain.enums.GrauLesao;
import br.com.cervicare.atendimento.domain.enums.ZonaTransformacao;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record ColposcopiaResponseDTO(
        Integer idColposcopia,
        Integer idPaciente,
        String nomePaciente,
        String nomeMedico,
        LocalDate dataRegistro,
        Boolean estrogenizacao,
        String jec,
        ZonaTransformacao zt,
        Boolean lesao,
        Boolean recidiva,
        GrauLesao grauLesao,
        ClassificacaoColposcopia classificacao,
        String observacao,
        Boolean verETratar,
        String verETratarMotivo,
        LocalDateTime dataEdicao
) {}