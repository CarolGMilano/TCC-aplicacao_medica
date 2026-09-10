package br.com.cervicare.medico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PerfilNomeRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 45, message = "O nome deve ter no máximo 45 caracteres")
        String nome
) {}