package br.com.colpocare.core.util;

import br.com.colpocare.auth.domain.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("Nenhum usuário autenticado no contexto de segurança.");
        }
        
        return (Usuario) authentication.getPrincipal();
    }
}