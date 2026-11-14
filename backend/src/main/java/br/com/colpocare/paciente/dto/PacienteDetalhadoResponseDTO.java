package br.com.colpocare.paciente.dto;

import br.com.colpocare.historico.dto.DadosGinecoObstetricosResponseDTO;
import br.com.colpocare.historico.dto.HistoricoIstResponseDTO;
import br.com.colpocare.historico.dto.HistoricoTabagismoResponseDTO;
import br.com.colpocare.historico.dto.SaudeSexualResponseDTO;
import br.com.colpocare.paciente.domain.enums.StatusPaciente;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record PacienteDetalhadoResponseDTO(
        Integer idPaciente,
        String nome,
        LocalDate dataNascimento,
        Integer idade,
        String prontuario,
        StatusPaciente status,
        Boolean grupoPrioritario,
        List<DadosGinecoObstetricosResponseDTO> dadosGinecoObstetricos,
        List<SaudeSexualResponseDTO> saudeSexual,
        List<HistoricoTabagismoResponseDTO> historicoTabagismo,
        List<HistoricoIstResponseDTO> historicoIst
) {}