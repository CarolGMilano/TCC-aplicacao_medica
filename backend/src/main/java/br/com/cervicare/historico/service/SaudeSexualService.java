package br.com.cervicare.historico.service;

import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.historico.domain.SaudeSexual;
import br.com.cervicare.historico.dto.SaudeSexualRequestDTO;
import br.com.cervicare.historico.dto.SaudeSexualResponseDTO;
import br.com.cervicare.historico.repository.SaudeSexualRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SaudeSexualService {

    private final SaudeSexualRepository saudeSexualRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public SaudeSexualResponseDTO registrar(SaudeSexualRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        SaudeSexual saude = new SaudeSexual();
        saude.setPaciente(paciente);
        saude.setSexarca(dto.sexarca());
        saude.setMac(dto.mac());
        saude.setNumParceiros(dto.numParceiros());
        saude.setVvs(dto.vvs());

        SaudeSexual salvo = saudeSexualRepository.save(saude);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<SaudeSexualResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return saudeSexualRepository.findByPaciente_IdPacienteOrderByIdDadosDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    private SaudeSexualResponseDTO converterParaDTO(SaudeSexual saude) {
        return SaudeSexualResponseDTO.builder()
                .idDados(saude.getIdDados())
                .idPaciente(saude.getPaciente().getIdPaciente())
                .sexarca(saude.getSexarca())
                .mac(saude.getMac())
                .numParceiros(saude.getNumParceiros())
                .vvs(saude.getVvs())
                .build();
    }
}