package br.com.cervicare.medico.dto;

import br.com.cervicare.auth.domain.enums.TipoUsuario;
import lombok.Builder;

@Builder
public record MedicoResponseDTO(
        Integer idMedico,
        Integer idUsuario,
        String nome,
        String crm,
        String especialidade,
        String email,
        TipoUsuario tipo,
        Boolean ativo
) {}