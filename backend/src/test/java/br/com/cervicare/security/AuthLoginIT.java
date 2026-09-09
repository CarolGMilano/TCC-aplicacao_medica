package br.com.cervicare.security;

import br.com.cervicare.auth.domain.Usuario;
import br.com.cervicare.auth.domain.enums.TipoUsuario;
import br.com.cervicare.auth.repository.UsuarioRepository;
import br.com.cervicare.medico.repository.MedicoRepository;
import br.com.cervicare.integration.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Import(MockMvcTestConfig.class)
@DisplayName("CerviCare - Login")
class AuthLoginIT extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void prepararBanco() {
        medicoRepository.deleteAll();
        usuarioRepository.deleteAll();

        Usuario usuario = new Usuario();
        usuario.setEmail("medico@cervicare.com");
        usuario.setSenha(passwordEncoder.encode("Senha@123"));
        usuario.setSalt("BCrypt");
        usuario.setAtivo(true);
        usuario.setTipo(TipoUsuario.MEDICO);

        usuarioRepository.save(usuario);
    }

    @Test
    @DisplayName("Deve realizar login com credenciais válidas")
    void deveRealizarLoginComCredenciaisValidas() throws Exception {

        String body = """
                {
                    "email": "medico@cervicare.com",
                    "senha": "Senha@123"
                }
                """;

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(body)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isNotEmpty())
        .andExpect(jsonPath("$.tipo").value("Bearer"));
    }

    @Test
    @DisplayName("Deve rejeitar senha inválida")
    void deveRejeitarSenhaInvalida() throws Exception {

        String body = """
                {
                    "email": "medico@cervicare.com",
                    "senha": "SenhaErrada"
                }
                """;

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(body)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Deve rejeitar usuário inexistente")
    void deveRejeitarUsuarioInexistente() throws Exception {

        String body = """
                {
                    "email": "naoexiste@cervicare.com",
                    "senha": "Senha@123"
                }
                """;

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(body)
        )
        .andExpect(status().isUnauthorized());
    }
}