package br.com.colpocare.security;

import br.com.colpocare.auth.domain.Usuario;
import br.com.colpocare.auth.domain.enums.TipoUsuario;
import br.com.colpocare.auth.repository.UsuarioRepository;
import br.com.colpocare.auth.service.TokenService;
import br.com.colpocare.medico.repository.MedicoRepository;
import br.com.colpocare.integration.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Import(MockMvcTestConfig.class)
@DisplayName("ColpoCare - Segurança da API")
class SecurityContextIT extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @BeforeEach
    void prepararBanco() {
        medicoRepository.deleteAll();
        usuarioRepository.deleteAll();

        Usuario usuario = new Usuario();
        usuario.setEmail("medico@colpocare.com");
        usuario.setSenha(passwordEncoder.encode("Senha@123"));
        usuario.setSalt("BCrypt");
        usuario.setAtivo(true);
        usuario.setTipo(TipoUsuario.MEDICO);

        usuarioRepository.save(usuario);
    }

    @Test
    @DisplayName("Deve rejeitar acesso sem token")
    void deveRejeitarAcessoSemToken() throws Exception {

        mockMvc.perform(
                get("/api/pacientes")
        ).andExpect(
                status().isUnauthorized()
        );
    }

    @Test
    @DisplayName("Deve rejeitar token inválido")
    void deveRejeitarTokenInvalido() throws Exception {

        mockMvc.perform(
                get("/api/pacientes")
                        .header(
                                "Authorization",
                                "Bearer token-invalido"
                        )
        ).andExpect(
                status().isUnauthorized()
        );
    }

    @Test
    @DisplayName("Deve permitir acesso com token válido")
    void devePermitirAcessoComTokenValido() throws Exception {

        UserDetails userDetails =
                usuarioRepository.findByEmailIgnoreCase(
                        "medico@colpocare.com"
                ).orElseThrow();

        String token =
                tokenService.gerarToken((Usuario) userDetails);

        mockMvc.perform(
                get("/api/pacientes")
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
        ).andExpect(
                status().isOk()
        );
    }
}