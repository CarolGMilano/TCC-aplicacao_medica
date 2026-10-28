package br.com.cervicare.dashboard.dto;

import lombok.Builder;

// Pacientes distintas com consulta ou exame registrado em cada período.
@Builder
public record PacientesAtendidasDTO(
        Long hoje,
        Long semana,
        Long mes
) {}
