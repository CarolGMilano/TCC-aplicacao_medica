package br.com.colpocare.paciente.dto;

public record PacienteResumoDTO(
        Integer idPaciente, 
        String nome, 
        String prontuario
) {}