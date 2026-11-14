package br.com.colpocare.atendimento.service;

import br.com.colpocare.atendimento.domain.Consulta;
import br.com.colpocare.atendimento.dto.ConsultaRequestDTO;
import br.com.colpocare.atendimento.dto.ConsultaResponseDTO;
import br.com.colpocare.atendimento.repository.ConsultaRepository;
import br.com.colpocare.core.exception.ResourceNotFoundException;
import br.com.colpocare.medico.domain.Medico;
import br.com.colpocare.medico.service.MedicoService;
import br.com.colpocare.paciente.domain.Paciente;
import br.com.colpocare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoService medicoService;

    @Transactional
    public ConsultaResponseDTO registrar(ConsultaRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        Medico medico = medicoService.getMedicoLogado();

        Consulta consulta = new Consulta();
        consulta.setPaciente(paciente);
        consulta.setMedico(medico);
        consulta.setDataHora(dto.dataHora());
        consulta.setObservacao(dto.observacao());

        Consulta salva = consultaRepository.save(consulta);

        return converterParaDTO(salva);
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return consultaRepository.findByPaciente_IdPacienteOrderByDataHoraDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    private ConsultaResponseDTO converterParaDTO(Consulta consulta) {
        return ConsultaResponseDTO.builder()
                .idConsulta(consulta.getIdConsulta())
                .idPaciente(consulta.getPaciente().getIdPaciente())
                .nomePaciente(consulta.getPaciente().getNome())
                .nomeMedico(consulta.getMedico().getNome())
                .dataHora(consulta.getDataHora())
                .observacao(consulta.getObservacao())
                .build();
    }
}