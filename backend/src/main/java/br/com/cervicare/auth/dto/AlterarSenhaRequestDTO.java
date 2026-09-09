package br.com.cervicare.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarSenhaRequestDTO(
        @NotBlank(message = "A senha atual é obrigatória")
        String senhaAtual,

        @NotBlank(message = "A nova senha é obrigatória")
        @Size(min = 8, message = "A nova senha precisa ter 8 caracteres ou mais")
        String senhaNova,

        @NotBlank(message = "A confirmação da senha é obrigatória")
        String senhaConf
) {}