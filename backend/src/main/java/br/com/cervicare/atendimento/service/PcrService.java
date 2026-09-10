package br.com.cervicare.atendimento.service;

import br.com.cervicare.atendimento.domain.PcrDnaHpv;
import br.com.cervicare.atendimento.dto.PcrRequestDTO;
import br.com.cervicare.atendimento.dto.PcrResponseDTO;
import br.com.cervicare.atendimento.repository.PcrDnaHpvRepository;
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
public class PcrService {

    private final PcrDnaHpvRepository pcrRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoService medicoService;

    @Transactional
    public PcrResponseDTO registrar(PcrRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        Medico medico = medicoService.getMedicoLogado();

        PcrDnaHpv pcr = new PcrDnaHpv();
        pcr.setPaciente(paciente);
        pcr.setMedico(medico);
        pcr.setDataRegistro(dto.dataRegistro());
        pcr.setResultado(dto.resultado());
        pcr.setTipoHpv(dto.tipoHpv());
        pcr.setObservacao(dto.observacao());
        pcr.setDataEdicao(LocalDateTime.now());

        PcrDnaHpv salvo = pcrRepository.save(pcr);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<PcrResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return pcrRepository.findByPaciente_IdPacienteOrderByDataRegistroDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public PcrResponseDTO atualizar(Integer idExame, PcrRequestDTO dto) {
        PcrDnaHpv pcr = pcrRepository.findById(idExame)
                .orElseThrow(() -> new ResourceNotFoundException("Exame PCR não encontrado."));

        pcr.setDataRegistro(dto.dataRegistro());
        pcr.setResultado(dto.resultado());
        pcr.setTipoHpv(dto.tipoHpv());
        pcr.setObservacao(dto.observacao());
        pcr.setDataEdicao(LocalDateTime.now());

        PcrDnaHpv atualizado = pcrRepository.save(pcr);
        return converterParaDTO(atualizado);
    }

    @Transactional
    public void deletar(Integer idExame) {
        if (!pcrRepository.existsById(idExame)) {
            throw new ResourceNotFoundException("Exame PCR não encontrado.");
        }
        pcrRepository.deleteById(idExame);
    }

    private PcrResponseDTO converterParaDTO(PcrDnaHpv pcr) {
        return PcrResponseDTO.builder()
                .idExame(pcr.getIdExame())
                .idPaciente(pcr.getPaciente().getIdPaciente())
                .nomePaciente(pcr.getPaciente().getNome())
                .nomeMedico(pcr.getMedico().getNome())
                .dataRegistro(pcr.getDataRegistro())
                .resultado(pcr.getResultado())
                .tipoHpv(pcr.getTipoHpv())
                .observacao(pcr.getObservacao())
                .dataEdicao(pcr.getDataEdicao())
                .build();
    }
}