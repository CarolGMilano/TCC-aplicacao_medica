package br.com.cervicare.dashboard.dto;

import java.time.LocalDate;

// Paciente sem citologia ou PCR há mais tempo que o prazo; ultimoExame nulo
// quando nunca fez exame.
public record PacienteSemExameDTO(
        Integer idPaciente,
        String nome,
        String prontuario,
        LocalDate ultimoExame
) {}
