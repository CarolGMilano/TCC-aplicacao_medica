package br.com.colpocare.dashboard.dto;

public record PacienteResumoDTO(
        Integer idPaciente, 
        String nome, 
        String prontuario
) {}