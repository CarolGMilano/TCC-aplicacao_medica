package br.com.colpocare.auth.service;

import br.com.colpocare.auth.domain.Usuario;
import br.com.colpocare.auth.dto.AlterarSenhaRequestDTO;
import br.com.colpocare.auth.repository.UsuarioRepository;
import br.com.colpocare.core.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    @Transactional
    public void alterarSenha(AlterarSenhaRequestDTO dto) {
        Usuario usuario = securityUtils.getUsuarioLogado();

        if (!passwordEncoder.matches(dto.senhaAtual(), usuario.getSenha())) {
            throw new IllegalArgumentException("A senha atual informada está incorreta.");
        }
        if (!dto.senhaNova().equals(dto.senhaConf())) {
            throw new IllegalArgumentException("A nova senha e a confirmação não coincidem.");
        }

        usuario.setSenha(passwordEncoder.encode(dto.senhaNova()));
        usuarioRepository.save(usuario);
    }
}