package br.com.colpocare.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("ColpoCare - Teste de Integração do Contexto")
class ColpocareContextIT extends AbstractIntegrationTest {

    @Test
    @DisplayName("Deve iniciar o contexto Spring usando MySQL do Testcontainers")
    void deveIniciarContextoSpringComMySql() {

        assertTrue(
                MYSQL.isRunning(),
                "O container MySQL deveria estar em execução"
        );
    }
}