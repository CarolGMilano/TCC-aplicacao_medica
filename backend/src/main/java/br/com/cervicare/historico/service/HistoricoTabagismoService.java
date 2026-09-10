package br.com.cervicare.historico.service;

import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.historico.domain.HistoricoTabagismo;
import br.com.cervicare.historico.dto.HistoricoTabagismoRequestDTO;
import br.com.cervicare.historico.dto.HistoricoTabagismoResponseDTO;
import br.com.cervicare.historico.repository.HistoricoTabagismoRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoTabagismoService {

    private final HistoricoTabagismoRepository tabagismoRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public HistoricoTabagismoResponseDTO registrar(HistoricoTabagismoRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        HistoricoTabagismo historico = new HistoricoTabagismo();
        historico.setPaciente(paciente);
        historico.setCigarrosDia(dto.cigarrosDia());
        historico.setIdadeInicio(dto.idadeInicio());
        historico.setIdadeFim(dto.idadeFim());
        historico.setFumante(dto.fumante());

        HistoricoTabagismo salvo = tabagismoRepository.save(historico);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<HistoricoTabagismoResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return tabagismoRepository.findByPaciente_IdPacienteOrderByIdHistoricoDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public HistoricoTabagismoResponseDTO atualizar(Integer idHistorico, HistoricoTabagismoRequestDTO dto) {
        HistoricoTabagismo historico = tabagismoRepository.findById(idHistorico)
                .orElseThrow(() -> new ResourceNotFoundException("Histórico de tabagismo não encontrado."));

        historico.setCigarrosDia(dto.cigarrosDia());
        historico.setIdadeInicio(dto.idadeInicio());
        historico.setIdadeFim(dto.idadeFim());
        historico.setFumante(dto.fumante());

        HistoricoTabagismo atualizado = tabagismoRepository.save(historico);
        return converterParaDTO(atualizado);
    }

    @Transactional
    public void deletar(Integer idHistorico) {
        if (!tabagismoRepository.existsById(idHistorico)) {
            throw new ResourceNotFoundException("Histórico de tabagismo não encontrado.");
        }
        tabagismoRepository.deleteById(idHistorico);
    }

    private HistoricoTabagismoResponseDTO converterParaDTO(HistoricoTabagismo historico) {
        return HistoricoTabagismoResponseDTO.builder()
                .idHistorico(historico.getIdHistorico())
                .idPaciente(historico.getPaciente().getIdPaciente())
                .cigarrosDia(historico.getCigarrosDia())
                .idadeInicio(historico.getIdadeInicio())
                .idadeFim(historico.getIdadeFim())
                .fumante(historico.getFumante())
                .build();
    }
}