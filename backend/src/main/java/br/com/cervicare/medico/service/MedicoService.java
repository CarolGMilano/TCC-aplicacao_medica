package br.com.cervicare.medico.service;

import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.core.util.SecurityUtils;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.medico.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository repository;
    private final SecurityUtils securityUtils;

    public Medico getMedicoLogado() {
        Integer idUsuario = securityUtils.getUsuarioLogado().getIdUsuario();
        
        return repository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de médico não encontrado para o usuário logado."));
    }
}