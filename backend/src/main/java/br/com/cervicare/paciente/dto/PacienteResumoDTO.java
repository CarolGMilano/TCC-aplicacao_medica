package br.com.cervicare.dashboard.dto;

public record PacienteResumoDTO(
        Integer idPaciente, 
        String nome, 
        String prontuario
) {}