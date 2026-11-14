package br.com.colpocare.auth.service;

import br.com.colpocare.auth.domain.Usuario;
import br.com.colpocare.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AutenticacaoService implements UserDetailsService {

    private final UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        return repository.findByEmailIgnoreCase(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuário não encontrado para o e-mail informado"
                        )
                );
    }
}