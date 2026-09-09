package br.com.cervicare.paciente.dto;

import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PacienteRequestDTO(

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 45, message = "O nome deve ter no máximo 45 caracteres")
        String nome,

        @NotNull(message = "A data de nascimento é obrigatória")
        @PastOrPresent(message = "A data de nascimento não pode ser no futuro")
        LocalDate dataNascimento,

        @NotBlank(message = "O prontuário é obrigatório")
        @Size(max = 50, message = "O prontuário deve ter no máximo 50 caracteres")
        String prontuario,

        @NotNull(message = "O status é obrigatório")
        StatusPaciente status

) {
}