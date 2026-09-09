package br.com.cervicare.medico.dto;

import br.com.cervicare.auth.domain.enums.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MedicoRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O CRM é obrigatório")
        String crm,

        @NotBlank(message = "A especialidade é obrigatória")
        String especialidade,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        String senha, // Opcional na atualização

        @NotNull(message = "O tipo de usuário é obrigatório")
        TipoUsuario tipo
) {}