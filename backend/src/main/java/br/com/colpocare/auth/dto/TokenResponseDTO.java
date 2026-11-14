package br.com.colpocare.auth.dto;

public record TokenResponseDTO(
    String token,
    String tipo
) {}