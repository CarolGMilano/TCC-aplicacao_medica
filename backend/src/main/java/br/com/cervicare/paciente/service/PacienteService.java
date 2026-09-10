package br.com.cervicare.paciente.service;

import br.com.cervicare.core.exception.DuplicateResourceException;
import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import br.com.cervicare.paciente.dto.PacienteRequestDTO;
import br.com.cervicare.paciente.dto.PacienteResponseDTO;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PacienteService {

    private final PacienteRepository repository;

    public Page<PacienteResponseDTO> listar(String busca, StatusPaciente status, Pageable pageable) {
        boolean possuiBusca = busca != null && !busca.trim().isEmpty();
        Page<Paciente> pacientes;

        if (possuiBusca && status != null) {
            pacientes = repository.findByStatusAndNomeContainingIgnoreCaseAndAtivoTrue(status, busca.trim(), pageable);
        } else if (possuiBusca) {
            pacientes = repository.buscarPorNomeOuProntuarioAtivos(busca.trim(), pageable);
        } else if (status != null) {
            pacientes = repository.findByStatusAndAtivoTrue(status, pageable);
        } else {
            pacientes = repository.findByAtivoTrue(pageable);
        }

        return pacientes.map(this::converterParaResponse);
    }

    public PacienteResponseDTO buscarPorId(Integer id) {
        return converterParaResponse(buscarEntidadePorId(id));
    }

    @Transactional
    public PacienteResponseDTO cadastrar(PacienteRequestDTO dto) {
        validarProntuarioParaCadastro(dto.prontuario());

        Paciente paciente = new Paciente();
        paciente.setNome(normalizarNome(dto.nome()));
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setProntuario(normalizarProntuario(dto.prontuario()));
        paciente.setStatus(dto.status());
        paciente.setAtivo(true);

        return converterParaResponse(repository.save(paciente));
    }

    @Transactional
    public PacienteResponseDTO atualizar(Integer id, PacienteRequestDTO dto) {
        Paciente paciente = buscarEntidadePorId(id);
        validarProntuarioParaAtualizacao(dto.prontuario(), id);

        paciente.setNome(normalizarNome(dto.nome()));
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setProntuario(normalizarProntuario(dto.prontuario()));
        paciente.setStatus(dto.status());

        return converterParaResponse(repository.save(paciente));
    }

    @Transactional
    public PacienteResponseDTO atualizarStatus(Integer id, StatusPaciente novoStatus) {
        Paciente paciente = buscarEntidadePorId(id);
        paciente.setStatus(novoStatus);
        return converterParaResponse(repository.save(paciente));
    }

    @Transactional
    public void deletar(Integer id) {
        Paciente paciente = buscarEntidadePorId(id);
        paciente.setAtivo(false);
        repository.save(paciente);
    }

    private Paciente buscarEntidadePorId(Integer id) {
        return repository.findByIdPacienteAndAtivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada ou inativa para o ID: " + id));
    }

    private void validarProntuarioParaCadastro(String prontuario) {
        String prontuarioNormalizado = normalizarProntuario(prontuario);
        if (repository.existsByProntuarioIgnoreCase(prontuarioNormalizado)) {
            throw new DuplicateResourceException("Já existe uma paciente cadastrada com o prontuário: " + prontuarioNormalizado);
        }
    }

    private void validarProntuarioParaAtualizacao(String prontuario, Integer idPaciente) {
        String prontuarioNormalizado = normalizarProntuario(prontuario);
        if (repository.existsByProntuarioIgnoreCaseAndIdPacienteNot(prontuarioNormalizado, idPaciente)) {
            throw new DuplicateResourceException("Já existe outra paciente cadastrada com o prontuário: " + prontuarioNormalizado);
        }
    }

    private PacienteResponseDTO converterParaResponse(Paciente paciente) {
        int idade = Period.between(paciente.getDataNascimento(), LocalDate.now()).getYears();
        boolean grupoPrioritario = idade >= 25 && idade <= 64;

        return PacienteResponseDTO.builder()
                .idPaciente(paciente.getIdPaciente())
                .nome(paciente.getNome())
                .dataNascimento(paciente.getDataNascimento())
                .idade(idade)
                .prontuario(paciente.getProntuario())
                .status(paciente.getStatus())
                .grupoPrioritario(grupoPrioritario)
                .build();
    }

    private String normalizarNome(String nome) {
        return nome == null ? null : nome.trim().replaceAll("\\s+", " ");
    }

    private String normalizarProntuario(String prontuario) {
        return prontuario == null ? null : prontuario.trim();
    }
}