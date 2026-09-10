package br.com.cervicare.atendimento.service;

import br.com.cervicare.atendimento.domain.Colposcopia;
import br.com.cervicare.atendimento.dto.ColposcopiaRequestDTO;
import br.com.cervicare.atendimento.dto.ColposcopiaResponseDTO;
import br.com.cervicare.atendimento.repository.ColposcopiaRepository;
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
public class ColposcopiaService {

    private final ColposcopiaRepository colposcopiaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoService medicoService;

    @Transactional
    public ColposcopiaResponseDTO registrar(ColposcopiaRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        Medico medico = medicoService.getMedicoLogado();

        Colposcopia colposcopia = new Colposcopia();
        colposcopia.setPaciente(paciente);
        colposcopia.setMedico(medico);
        colposcopia.setDataRegistro(dto.dataRegistro());
        colposcopia.setEstrogenizacao(dto.estrogenizacao());
        colposcopia.setJec(dto.jec());
        colposcopia.setZt(dto.zt());
        colposcopia.setLesao(dto.lesao());
        colposcopia.setRecidiva(dto.recidiva());
        colposcopia.setGrauLesao(dto.grauLesao());
        colposcopia.setClassificacao(dto.classificacao());
        colposcopia.setObservacao(dto.observacao());
        colposcopia.setVerETratar(dto.verETratar());
        colposcopia.setVerETratarMotivo(dto.verETratarMotivo());
        colposcopia.setDataEdicao(LocalDateTime.now());

        Colposcopia salva = colposcopiaRepository.save(colposcopia);

        return converterParaDTO(salva);
    }

    @Transactional(readOnly = true)
    public List<ColposcopiaResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return colposcopiaRepository.findByPaciente_IdPacienteOrderByDataRegistroDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public ColposcopiaResponseDTO atualizar(Integer idColposcopia, ColposcopiaRequestDTO dto) {
        Colposcopia colposcopia = colposcopiaRepository.findById(idColposcopia)
                .orElseThrow(() -> new ResourceNotFoundException("Exame de colposcopia não encontrado."));

        colposcopia.setDataRegistro(dto.dataRegistro());
        colposcopia.setEstrogenizacao(dto.estrogenizacao());
        colposcopia.setJec(dto.jec());
        colposcopia.setZt(dto.zt());
        colposcopia.setLesao(dto.lesao());
        colposcopia.setRecidiva(dto.recidiva());
        colposcopia.setGrauLesao(dto.grauLesao());
        colposcopia.setClassificacao(dto.classificacao());
        colposcopia.setObservacao(dto.observacao());
        colposcopia.setVerETratar(dto.verETratar());
        colposcopia.setVerETratarMotivo(dto.verETratarMotivo());
        colposcopia.setDataEdicao(LocalDateTime.now());

        Colposcopia atualizada = colposcopiaRepository.save(colposcopia);
        return converterParaDTO(atualizada);
    }

    @Transactional
    public void deletar(Integer idColposcopia) {
        if (!colposcopiaRepository.existsById(idColposcopia)) {
            throw new ResourceNotFoundException("Exame de colposcopia não encontrado.");
        }
        colposcopiaRepository.deleteById(idColposcopia);
    }

    private ColposcopiaResponseDTO converterParaDTO(Colposcopia colposcopia) {
        return ColposcopiaResponseDTO.builder()
                .idColposcopia(colposcopia.getIdColposcopia())
                .idPaciente(colposcopia.getPaciente().getIdPaciente())
                .nomePaciente(colposcopia.getPaciente().getNome())
                .nomeMedico(colposcopia.getMedico().getNome())
                .dataRegistro(colposcopia.getDataRegistro())
                .estrogenizacao(colposcopia.getEstrogenizacao())
                .jec(colposcopia.getJec())
                .zt(colposcopia.getZt())
                .lesao(colposcopia.getLesao())
                .recidiva(colposcopia.getRecidiva())
                .grauLesao(colposcopia.getGrauLesao())
                .classificacao(colposcopia.getClassificacao())
                .observacao(colposcopia.getObservacao())
                .verETratar(colposcopia.getVerETratar())
                .verETratarMotivo(colposcopia.getVerETratarMotivo())
                .dataEdicao(colposcopia.getDataEdicao())
                .build();
    }
}