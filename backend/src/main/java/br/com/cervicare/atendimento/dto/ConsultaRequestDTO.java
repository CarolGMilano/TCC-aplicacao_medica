package br.com.cervicare.atendimento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConsultaRequestDTO(
        @NotNull(message = "O ID da paciente é obrigatório") 
        Integer idPaciente,

        @NotNull(message = "A data e hora da consulta são obrigatórias") 
        LocalDateTime dataHora,

        @NotBlank(message = "A observação é obrigatória") 
        String observacao
) {}