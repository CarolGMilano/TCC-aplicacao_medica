package br.com.cervicare.atendimento.service;

import br.com.cervicare.atendimento.domain.Procedimento;
import br.com.cervicare.atendimento.dto.ProcedimentoRequestDTO;
import br.com.cervicare.atendimento.dto.ProcedimentoResponseDTO;
import br.com.cervicare.atendimento.repository.ProcedimentoRepository;
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
public class ProcedimentoService {

    private final ProcedimentoRepository procedimentoRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoService medicoService;

    @Transactional
    public ProcedimentoResponseDTO registrar(ProcedimentoRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        Medico medico = medicoService.getMedicoLogado();

        Procedimento procedimento = new Procedimento();
        procedimento.setPaciente(paciente);
        procedimento.setMedico(medico);
        procedimento.setDataRegistro(dto.dataRegistro());
        procedimento.setTipo(dto.tipo());
        procedimento.setQtFragmento(dto.qtFragmento());
        procedimento.setMargemEndocervical(dto.margemEndocervical());
        procedimento.setMargemEctocervical(dto.margemEctocervical());
        procedimento.setResultado(dto.resultado());
        procedimento.setObservacao(dto.observacao());
        procedimento.setDataEdicao(LocalDateTime.now());

        Procedimento salvo = procedimentoRepository.save(procedimento);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<ProcedimentoResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return procedimentoRepository.findByPaciente_IdPacienteOrderByDataRegistroDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public ProcedimentoResponseDTO atualizar(Integer idProcedimento, ProcedimentoRequestDTO dto) {
        Procedimento procedimento = procedimentoRepository.findById(idProcedimento)
                .orElseThrow(() -> new ResourceNotFoundException("Procedimento não encontrado."));

        procedimento.setDataRegistro(dto.dataRegistro());
        procedimento.setTipo(dto.tipo());
        procedimento.setQtFragmento(dto.qtFragmento());
        procedimento.setMargemEndocervical(dto.margemEndocervical());
        procedimento.setMargemEctocervical(dto.margemEctocervical());
        procedimento.setResultado(dto.resultado());
        procedimento.setObservacao(dto.observacao());
        procedimento.setDataEdicao(LocalDateTime.now());

        Procedimento atualizado = procedimentoRepository.save(procedimento);
        return converterParaDTO(atualizado);
    }

    @Transactional
    public void deletar(Integer idProcedimento) {
        if (!procedimentoRepository.existsById(idProcedimento)) {
            throw new ResourceNotFoundException("Procedimento não encontrado.");
        }
        procedimentoRepository.deleteById(idProcedimento);
    }

    private ProcedimentoResponseDTO converterParaDTO(Procedimento procedimento) {
        return ProcedimentoResponseDTO.builder()
                .idProcedimento(procedimento.getIdProcedimento())
                .idPaciente(procedimento.getPaciente().getIdPaciente())
                .nomePaciente(procedimento.getPaciente().getNome())
                .nomeMedico(procedimento.getMedico().getNome())
                .dataRegistro(procedimento.getDataRegistro())
                .tipo(procedimento.getTipo())
                .qtFragmento(procedimento.getQtFragmento())
                .margemEndocervical(procedimento.getMargemEndocervical())
                .margemEctocervical(procedimento.getMargemEctocervical())
                .resultado(procedimento.getResultado())
                .observacao(procedimento.getObservacao())
                .dataEdicao(procedimento.getDataEdicao())
                .build();
    }
}