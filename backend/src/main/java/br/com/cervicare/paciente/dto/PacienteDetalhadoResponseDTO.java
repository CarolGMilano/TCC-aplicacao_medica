package br.com.cervicare.paciente.dto;

import br.com.cervicare.historico.dto.DadosGinecoObstetricosResponseDTO;
import br.com.cervicare.historico.dto.HistoricoIstResponseDTO;
import br.com.cervicare.historico.dto.HistoricoTabagismoResponseDTO;
import br.com.cervicare.historico.dto.SaudeSexualResponseDTO;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
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