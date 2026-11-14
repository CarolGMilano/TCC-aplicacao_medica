package br.com.colpocare.historico.service;

import br.com.colpocare.core.exception.ResourceNotFoundException;
import br.com.colpocare.historico.domain.HistoricoTabagismo;
import br.com.colpocare.historico.dto.HistoricoTabagismoRequestDTO;
import br.com.colpocare.historico.dto.HistoricoTabagismoResponseDTO;
import br.com.colpocare.historico.repository.HistoricoTabagismoRepository;
import br.com.colpocare.paciente.domain.Paciente;
import br.com.colpocare.paciente.repository.PacienteRepository;
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