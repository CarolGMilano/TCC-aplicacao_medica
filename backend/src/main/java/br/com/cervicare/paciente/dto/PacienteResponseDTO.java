package br.com.cervicare.paciente.dto;

import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record PacienteResponseDTO(

        Integer idPaciente,

        String nome,

        LocalDate dataNascimento,

        Integer idade,

        String prontuario,

        StatusPaciente status,

        Boolean grupoPrioritario

) {
}