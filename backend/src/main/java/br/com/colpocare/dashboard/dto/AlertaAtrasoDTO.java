package br.com.colpocare.dashboard.dto;

import lombok.Builder;

@Builder
public record AlertaAtrasoDTO(
    Integer idPaciente,
    String nome,
    String prontuario,
    String status,
    Long diasAtraso,
    String tipoAlerta
) {}