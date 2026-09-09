package br.com.cervicare.historico.service;

import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.historico.domain.HistoricoIst;
import br.com.cervicare.historico.dto.HistoricoIstRequestDTO;
import br.com.cervicare.historico.dto.HistoricoIstResponseDTO;
import br.com.cervicare.historico.repository.HistoricoIstRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoIstService {

    private final HistoricoIstRepository istRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public HistoricoIstResponseDTO registrar(HistoricoIstRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        HistoricoIst historico = new HistoricoIst();
        historico.setPaciente(paciente);
        historico.setIst(dto.ist());
        historico.setCondilomaHpv(dto.condilomaHpv());

        HistoricoIst salvo = istRepository.save(historico);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<HistoricoIstResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return istRepository.findByPaciente_IdPacienteOrderByIdHistoricoDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    private HistoricoIstResponseDTO converterParaDTO(HistoricoIst historico) {
        return HistoricoIstResponseDTO.builder()
                .idHistorico(historico.getIdHistorico())
                .idPaciente(historico.getPaciente().getIdPaciente())
                .ist(historico.getIst())
                .condilomaHpv(historico.getCondilomaHpv())
                .build();
    }
}