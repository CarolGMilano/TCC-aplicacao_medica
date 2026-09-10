package br.com.cervicare.atendimento.service;

import br.com.cervicare.atendimento.domain.Citologia;
import br.com.cervicare.atendimento.dto.CitologiaRequestDTO;
import br.com.cervicare.atendimento.dto.CitologiaResponseDTO;
import br.com.cervicare.atendimento.repository.CitologiaRepository;
import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.medico.service.MedicoService;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitologiaService {

    private final CitologiaRepository citologiaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoService medicoService;

    @Transactional
    public CitologiaResponseDTO registrar(CitologiaRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        Medico medico = medicoService.getMedicoLogado();

        Citologia citologia = new Citologia();
        citologia.setPaciente(paciente);
        citologia.setMedico(medico);
        citologia.setDataRegistro(dto.dataRegistro());
        citologia.setResultado(dto.resultado());
        citologia.setObservacao(dto.observacao());
        citologia.setDataEdicao(LocalDateTime.now());

        Citologia salva = citologiaRepository.save(citologia);

        return converterParaDTO(salva);
    }

    @Transactional(readOnly = true)
    public List<CitologiaResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return citologiaRepository.findByPaciente_IdPacienteOrderByDataRegistroDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public CitologiaResponseDTO atualizar(Integer idExame, CitologiaRequestDTO dto) {
        Citologia citologia = citologiaRepository.findById(idExame)
                .orElseThrow(() -> new ResourceNotFoundException("Exame de citologia não encontrado."));

        citologia.setDataRegistro(dto.dataRegistro());
        citologia.setResultado(dto.resultado());
        citologia.setObservacao(dto.observacao());
        citologia.setDataEdicao(LocalDateTime.now());

        Citologia atualizada = citologiaRepository.save(citologia);
        return converterParaDTO(atualizada);
    }

    @Transactional
    public void deletar(Integer idExame) {
        if (!citologiaRepository.existsById(idExame)) {
            throw new ResourceNotFoundException("Exame de citologia não encontrado.");
        }
        citologiaRepository.deleteById(idExame);
    }

    private CitologiaResponseDTO converterParaDTO(Citologia citologia) {
        return CitologiaResponseDTO.builder()
                .idExame(citologia.getIdExame())
                .idPaciente(citologia.getPaciente().getIdPaciente())
                .nomePaciente(citologia.getPaciente().getNome())
                .nomeMedico(citologia.getMedico().getNome())
                .dataRegistro(citologia.getDataRegistro())
                .resultado(citologia.getResultado())
                .observacao(citologia.getObservacao())
                .dataEdicao(citologia.getDataEdicao())
                .build();
    }
}