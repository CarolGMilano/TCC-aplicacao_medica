package br.com.cervicare.historico.service;

import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.historico.domain.DadosGinecoObstetricos;
import br.com.cervicare.historico.dto.DadosGinecoObstetricosRequestDTO;
import br.com.cervicare.historico.dto.DadosGinecoObstetricosResponseDTO;
import br.com.cervicare.historico.repository.DadosGinecoObstetricosRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DadosGinecoObstetricosService {

    private final DadosGinecoObstetricosRepository dadosRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public DadosGinecoObstetricosResponseDTO registrar(DadosGinecoObstetricosRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        DadosGinecoObstetricos dados = new DadosGinecoObstetricos();
        dados.setPaciente(paciente);
        dados.setNumGestacao(dto.numGestacao());
        dados.setNumPartoNormal(dto.numPartoNormal());
        dados.setNumCesariana(dto.numCesariana());
        dados.setNumAborto(dto.numAborto());
        dados.setMenarca(dto.menarca());
        dados.setMenopausa(dto.menopausa());

        DadosGinecoObstetricos salvo = dadosRepository.save(dados);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<DadosGinecoObstetricosResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return dadosRepository.findByPaciente_IdPacienteOrderByIdDadosDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public DadosGinecoObstetricosResponseDTO atualizar(Integer idDados, DadosGinecoObstetricosRequestDTO dto) {
        DadosGinecoObstetricos dados = dadosRepository.findById(idDados)
                .orElseThrow(() -> new ResourceNotFoundException("Dados gineco-obstétricos não encontrados."));

        dados.setNumGestacao(dto.numGestacao());
        dados.setNumPartoNormal(dto.numPartoNormal());
        dados.setNumCesariana(dto.numCesariana());
        dados.setNumAborto(dto.numAborto());
        dados.setMenarca(dto.menarca());
        dados.setMenopausa(dto.menopausa());

        DadosGinecoObstetricos atualizado = dadosRepository.save(dados);
        return converterParaDTO(atualizado);
    }

    @Transactional
    public void deletar(Integer idDados) {
        if (!dadosRepository.existsById(idDados)) {
            throw new ResourceNotFoundException("Dados gineco-obstétricos não encontrados.");
        }
        dadosRepository.deleteById(idDados);
    }

    private DadosGinecoObstetricosResponseDTO converterParaDTO(DadosGinecoObstetricos dados) {
        return DadosGinecoObstetricosResponseDTO.builder()
                .idDados(dados.getIdDados())
                .idPaciente(dados.getPaciente().getIdPaciente())
                .numGestacao(dados.getNumGestacao())
                .numPartoNormal(dados.getNumPartoNormal())
                .numCesariana(dados.getNumCesariana())
                .numAborto(dados.getNumAborto())
                .menarca(dados.getMenarca())
                .menopausa(dados.getMenopausa())
                .build();
    }
}