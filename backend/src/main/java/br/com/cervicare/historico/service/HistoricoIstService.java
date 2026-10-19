package br.com.cervicare.historico.service;

import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.historico.domain.HistoricoIst;
import br.com.cervicare.historico.dto.HistoricoIstRequestDTO;
import br.com.cervicare.historico.dto.HistoricoIstResponseDTO;
import br.com.cervicare.historico.repository.HistoricoIstRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoIstService {

    private final HistoricoIstRepository istRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public HistoricoIstResponseDTO registrar(HistoricoIstRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.idPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + dto.idPaciente()));

        HistoricoIst historico = new HistoricoIst();
        historico.setPaciente(paciente);
        historico.setIst(dto.ist());
        historico.setCondilomaHpv(dto.condilomaHpv());

        HistoricoIst salvo = istRepository.save(historico);

        return converterParaDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<HistoricoIstResponseDTO> listarPorPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente)) {
            throw new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente);
        }

        return istRepository.findByPaciente_IdPacienteOrderByIdHistoricoDesc(idPaciente)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public HistoricoIstResponseDTO atualizar(Integer idHistorico, HistoricoIstRequestDTO dto) {
        HistoricoIst historico = istRepository.findById(idHistorico)
                .orElseThrow(() -> new ResourceNotFoundException("Histórico de IST não encontrado."));

        historico.setIst(dto.ist());
        historico.setCondilomaHpv(dto.condilomaHpv());

        HistoricoIst atualizado = istRepository.save(historico);
        return converterParaDTO(atualizado);
    }

    @Transactional
    public void deletar(Integer idHistorico) {
        if (!istRepository.existsById(idHistorico)) {
            throw new ResourceNotFoundException("Histórico de IST não encontrado.");
        }
        istRepository.deleteById(idHistorico);
    }

    @Transactional
    public void sincronizarIsts(Integer idPaciente, List<HistoricoIstRequestDTO> novasIsts) {
        Paciente paciente = pacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrada para o ID: " + idPaciente));

        List<HistoricoIst> atuais = istRepository.findByPaciente_IdPacienteOrderByIdHistoricoDesc(idPaciente);

        // Se a lista vier vazia ou nula, o usuário desmarcou tudo no front: apagamos todas as ISTs do banco
        if (novasIsts == null || novasIsts.isEmpty()) {
            istRepository.deleteAll(atuais);
            return;
        }

        // 1. Remover as ISTs antigas que não vieram na nova lista (foram desmarcadas)
        List<HistoricoIst> paraRemover = atuais.stream()
                .filter(istAtual -> novasIsts.stream().noneMatch(novo -> novo.ist().equals(istAtual.getIst())))
                .toList();
        istRepository.deleteAll(paraRemover);

        // 2. Adicionar as novas ISTs ou atualizar o status do condiloma das existentes
        for (HistoricoIstRequestDTO dto : novasIsts) {
            HistoricoIst existente = atuais.stream()
                    .filter(istAtual -> istAtual.getIst().equals(dto.ist()))
                    .findFirst()
                    .orElse(null);

            if (existente != null) {
                // Se já existe, apenas atualiza caso a opção de condiloma tenha mudado
                existente.setCondilomaHpv(dto.condilomaHpv());
                istRepository.save(existente);
            } else {
                // Se não existe, cria um novo registro
                HistoricoIst novaIst = new HistoricoIst();
                novaIst.setPaciente(paciente);
                novaIst.setIst(dto.ist());
                novaIst.setCondilomaHpv(dto.condilomaHpv());
                istRepository.save(novaIst);
            }
        }
    }

    private HistoricoIstResponseDTO converterParaDTO(HistoricoIst historico) {
        return HistoricoIstResponseDTO.builder()
                .idHistorico(historico.getIdHistorico())
                .idPaciente(historico.getPaciente().getIdPaciente())
                .ist(historico.getIst())
                .condilomaHpv(historico.getCondilomaHpv())
                .build();
    }
}