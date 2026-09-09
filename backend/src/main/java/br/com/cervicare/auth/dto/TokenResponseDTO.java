package br.com.cervicare.auth.dto;

public record TokenResponseDTO(
    String token,
    String tipo
) {}