package br.com.cervicare.paciente.service;

import br.com.cervicare.atendimento.domain.Consulta;
import br.com.cervicare.atendimento.repository.ConsultaRepository;
import br.com.cervicare.core.exception.DuplicateResourceException;
import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.historico.domain.DadosGinecoObstetricos;
import br.com.cervicare.historico.domain.HistoricoIst;
import br.com.cervicare.historico.domain.HistoricoTabagismo;
import br.com.cervicare.historico.domain.SaudeSexual;
import br.com.cervicare.historico.repository.DadosGinecoObstetricosRepository;
import br.com.cervicare.historico.repository.HistoricoIstRepository;
import br.com.cervicare.historico.repository.HistoricoTabagismoRepository;
import br.com.cervicare.historico.repository.SaudeSexualRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import br.com.cervicare.paciente.dto.PacienteCompletoRequestDTO;
import br.com.cervicare.paciente.dto.PacienteRequestDTO;
import br.com.cervicare.paciente.dto.PacienteResponseDTO;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PacienteService {

    private final PacienteRepository repository;
    private final ConsultaRepository consultaRepository;
    private final DadosGinecoObstetricosRepository dadosGinecoObstetricosRepository;
    private final SaudeSexualRepository saudeSexualRepository;
    private final HistoricoTabagismoRepository tabagismoRepository;
    private final HistoricoIstRepository istRepository;

    public Page<PacienteResponseDTO> listar(
            String busca,
            StatusPaciente status,
            Pageable pageable
    ) {
        boolean possuiBusca = busca != null && !busca.trim().isEmpty();
        Page<Paciente> pacientes;

        if (possuiBusca && status != null) {
            pacientes = repository.findByStatusAndNomeContainingIgnoreCaseAndAtivoTrue(
                    status,
                    busca.trim(),
                    pageable
            );
        } else if (possuiBusca) {
            pacientes = repository.buscarPorNomeOuProntuarioAtivos(
                    busca.trim(),
                    pageable
            );
        } else if (status != null) {
            pacientes = repository.findByStatusAndAtivoTrue(
                    status,
                    pageable
            );
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
    public PacienteResponseDTO cadastrarCompleto(PacienteCompletoRequestDTO dto) {

        PacienteResponseDTO pacienteDTO = cadastrar(dto.paciente());

        Integer idCriado = pacienteDTO.idPaciente();

        Paciente pacienteRef = repository.getReferenceById(idCriado);

        if (dto.dadosGinecoObstetricos() != null) {
            DadosGinecoObstetricos dados = new DadosGinecoObstetricos(
                    null,
                    pacienteRef,
                    dto.dadosGinecoObstetricos().numGestacao(),
                    dto.dadosGinecoObstetricos().numPartoNormal(),
                    dto.dadosGinecoObstetricos().numCesariana(),
                    dto.dadosGinecoObstetricos().numAborto(),
                    dto.dadosGinecoObstetricos().menarca(),
                    dto.dadosGinecoObstetricos().menopausa()
            );

            dadosGinecoObstetricosRepository.save(dados);
        }

        if (dto.saudeSexual() != null) {
            SaudeSexual saudeSexual = new SaudeSexual(
                    null,
                    pacienteRef,
                    dto.saudeSexual().sexarca(),
                    dto.saudeSexual().mac(),
                    dto.saudeSexual().numParceiros(),
                    dto.saudeSexual().vvs()
            );

            saudeSexualRepository.save(saudeSexual);
        }

        if (dto.historicoTabagismo() != null) {
            HistoricoTabagismo tabagismo = new HistoricoTabagismo(
                    null,
                    pacienteRef,
                    dto.historicoTabagismo().cigarrosDia(),
                    dto.historicoTabagismo().idadeInicio(),
                    dto.historicoTabagismo().idadeFim(),
                    dto.historicoTabagismo().fumante()
            );

            tabagismoRepository.save(tabagismo);
        }

        if (dto.historicoIst() != null && !dto.historicoIst().isEmpty()) {
            List<HistoricoIst> ists = dto.historicoIst()
                    .stream()
                    .map(istDto -> new HistoricoIst(
                            null,
                            pacienteRef,
                            istDto.ist(),
                            istDto.condilomaHpv()
                    ))
                    .toList();

            istRepository.saveAll(ists);
        }

        return converterParaResponse(pacienteRef);
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
    public PacienteResponseDTO atualizarStatus(
            Integer id,
            StatusPaciente novoStatus
    ) {
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
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Paciente não encontrada ou inativa para o ID: " + id
                        )
                );
    }

    private void validarProntuarioParaCadastro(String prontuario) {
        String prontuarioNormalizado = normalizarProntuario(prontuario);

        if (repository.existsByProntuarioIgnoreCase(prontuarioNormalizado)) {
            throw new DuplicateResourceException(
                    "Já existe uma paciente cadastrada com o prontuário: "
                            + prontuarioNormalizado
            );
        }
    }

    private void validarProntuarioParaAtualizacao(
            String prontuario,
            Integer idPaciente
    ) {
        String prontuarioNormalizado = normalizarProntuario(prontuario);

        if (repository.existsByProntuarioIgnoreCaseAndIdPacienteNot(
                prontuarioNormalizado,
                idPaciente
        )) {
            throw new DuplicateResourceException(
                    "Já existe outra paciente cadastrada com o prontuário: "
                            + prontuarioNormalizado
            );
        }
    }

    private PacienteResponseDTO converterParaResponse(Paciente paciente) {
        int idade = Period.between(
                paciente.getDataNascimento(),
                LocalDate.now()
        ).getYears();

        boolean grupoPrioritario = idade >= 25 && idade <= 64;

        LocalDateTime ultimaConsultaData = consultaRepository
                .findFirstByPaciente_IdPacienteOrderByDataHoraDesc(
                        paciente.getIdPaciente()
                )
                .map(Consulta::getDataHora)
                .orElse(null);

        return PacienteResponseDTO.builder()
                .idPaciente(paciente.getIdPaciente())
                .nome(paciente.getNome())
                .dataNascimento(paciente.getDataNascimento())
                .idade(idade)
                .prontuario(paciente.getProntuario())
                .status(paciente.getStatus())
                .grupoPrioritario(grupoPrioritario)
                .ultimaConsulta(ultimaConsultaData)
                .build();
    }

    private String normalizarNome(String nome) {
        return nome == null
                ? null
                : nome.trim().replaceAll("\\s+", " ");
    }

    private String normalizarProntuario(String prontuario) {
        return prontuario == null
                ? null
                : prontuario.trim();
    }
}