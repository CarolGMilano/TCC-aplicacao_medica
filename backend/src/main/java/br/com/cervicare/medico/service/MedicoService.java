package br.com.cervicare.medico.service;

import br.com.cervicare.auth.domain.Usuario;
import br.com.cervicare.auth.domain.enums.TipoUsuario;
import br.com.cervicare.auth.repository.UsuarioRepository;
import br.com.cervicare.core.exception.DuplicateResourceException;
import br.com.cervicare.core.exception.ResourceNotFoundException;
import br.com.cervicare.core.util.SecurityUtils;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.medico.dto.MedicoRequestDTO;
import br.com.cervicare.medico.dto.MedicoResponseDTO;
import br.com.cervicare.medico.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SecurityUtils securityUtils;
    private final PasswordEncoder passwordEncoder;

    public Medico getMedicoLogado() {
        Integer idUsuario = securityUtils.getUsuarioLogado().getIdUsuario();
        return medicoRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de médico não encontrado para o usuário logado."));
    }

    @Transactional(readOnly = true)
    public Page<MedicoResponseDTO> listar(String busca, String especialidade, TipoUsuario tipo, Pageable pageable) {
        String termoBusca = (busca != null && !busca.isBlank()) ? busca.trim() : null;
        String especialidadeFiltro = (especialidade != null && !especialidade.equalsIgnoreCase("Todas")) ? especialidade : null;
        
        return medicoRepository.filtrarProfissionais(termoBusca, especialidadeFiltro, tipo, pageable)
                .map(this::converterParaDTO);
    }

    @Transactional
    public MedicoResponseDTO cadastrar(MedicoRequestDTO dto) {
        if (usuarioRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new DuplicateResourceException("E-mail já cadastrado no sistema.");
        }
        if (medicoRepository.existsByCrmIgnoreCase(dto.crm())) {
            throw new DuplicateResourceException("CRM já cadastrado no sistema.");
        }
        if (dto.senha() == null || dto.senha().isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória para novos cadastros.");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(dto.email().trim());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setSalt("BCrypt");
        usuario.setAtivo(true);
        usuario.setTipo(dto.tipo());
        usuario = usuarioRepository.save(usuario);

        Medico medico = new Medico();
        medico.setUsuario(usuario);
        medico.setNome(dto.nome().trim());
        medico.setCrm(dto.crm().trim());
        medico.setEspecialidade(dto.especialidade().trim());
        medico = medicoRepository.save(medico);

        return converterParaDTO(medico);
    }

    @Transactional
    public MedicoResponseDTO atualizar(Integer id, MedicoRequestDTO dto) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado."));

        if (!medico.getUsuario().getEmail().equalsIgnoreCase(dto.email()) && usuarioRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new DuplicateResourceException("E-mail já cadastrado por outro usuário.");
        }
        if (medicoRepository.existsByCrmIgnoreCaseAndIdMedicoNot(dto.crm(), id)) {
            throw new DuplicateResourceException("CRM já cadastrado por outro profissional.");
        }

        Usuario usuario = medico.getUsuario();
        usuario.setEmail(dto.email().trim());
        usuario.setTipo(dto.tipo());
        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.senha()));
        }

        medico.setNome(dto.nome().trim());
        medico.setCrm(dto.crm().trim());
        medico.setEspecialidade(dto.especialidade().trim());

        return converterParaDTO(medico);
    }

    @Transactional
    public void inativar(Integer id) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado."));
        medico.getUsuario().setAtivo(false);
    }

    @Transactional
    public MedicoResponseDTO atualizarNomePerfil(String novoNome) {
        Medico medico = getMedicoLogado();
        if (novoNome == null || novoNome.isBlank()) {
            throw new IllegalArgumentException("O nome não pode ser vazio.");
        }
        medico.setNome(novoNome.trim());
        return converterParaDTO(medico);
    }

    public MedicoResponseDTO obterPerfilLogado() {
        return converterParaDTO(getMedicoLogado());
    }

    private MedicoResponseDTO converterParaDTO(Medico medico) {
        return MedicoResponseDTO.builder()
                .idMedico(medico.getIdMedico())
                .idUsuario(medico.getUsuario().getIdUsuario())
                .nome(medico.getNome())
                .crm(medico.getCrm())
                .especialidade(medico.getEspecialidade())
                .email(medico.getUsuario().getEmail())
                .tipo(medico.getUsuario().getTipo())
                .ativo(medico.getUsuario().getAtivo())
                .build();
    }
}