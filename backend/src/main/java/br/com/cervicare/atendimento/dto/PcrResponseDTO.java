package br.com.cervicare.atendimento.dto;

import br.com.cervicare.atendimento.domain.enums.ResultadoPcr;
import br.com.cervicare.atendimento.domain.enums.TipoHpv;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record PcrResponseDTO(
        Integer idExame,
        Integer idPaciente,
        String nomePaciente,
        String nomeMedico,
        LocalDate dataRegistro,
        ResultadoPcr resultado,
        List<TipoHpv> tiposHpv,
        String observacao,
        LocalDateTime dataEdicao
) {}