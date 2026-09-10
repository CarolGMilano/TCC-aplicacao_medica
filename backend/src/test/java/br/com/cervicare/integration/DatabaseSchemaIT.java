package br.com.cervicare.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("CerviCare - Validação do Schema do Banco")
class DatabaseSchemaIT extends AbstractIntegrationTest {

    @Test
    @DisplayName("Deve possuir todas as tabelas principais do CerviCare")
    void devePossuirTodasAsTabelasPrincipais() throws SQLException {

        List<String> tabelasEsperadas = List.of(
                "usuario",
                "medico",
                "paciente",
                "consulta",
                "saude_sexual",
                "dados_gineco_obstetricos",
                "historico_tabagismo",
                "historico_ist",
                "procedimento",
                "colposcopia",
                "citologia",
                "pcr_dna_hpv"
        );

        try (Connection connection = MYSQL.createConnection("")) {

            DatabaseMetaData metadata = connection.getMetaData();

            for (String tabela : tabelasEsperadas) {

                try (ResultSet resultSet = metadata.getTables(
                        connection.getCatalog(),
                        null,
                        tabela,
                        new String[]{"TABLE"}
                )) {

                    assertTrue(
                            resultSet.next(),
                            "A tabela '" + tabela + "' deveria existir no banco"
                    );
                }
            }
        }
    }

    @Test
    @DisplayName("Deve possuir exatamente as quatro migrations aplicadas")
    void devePossuirAsQuatroMigrationsAplicadas() throws SQLException {

        String sql = """
                SELECT COUNT(*)
                FROM flyway_schema_history
                WHERE success = TRUE
                """;

        try (
                Connection connection = MYSQL.createConnection("");
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(sql)
        ) {

            assertTrue(resultSet.next());

            int quantidadeMigrations = resultSet.getInt(1);

            assertEquals(
                    4,
                    quantidadeMigrations,
                    "O banco de teste deveria possuir exatamente 4 migrations aplicadas"
            );
        }
    }

    @Test
    @DisplayName("Deve estar na versão 4 do Flyway")
    void deveEstarNaVersaoQuatroDoFlyway() throws SQLException {

        String sql = """
                SELECT version
                FROM flyway_schema_history
                WHERE success = TRUE
                ORDER BY installed_rank DESC
                LIMIT 1
                """;

        try (
                Connection connection = MYSQL.createConnection("");
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(sql)
        ) {

            assertTrue(
                    resultSet.next(),
                    "O Flyway deveria possuir pelo menos uma migration aplicada"
            );

            assertEquals(
                    "4",
                    resultSet.getString("version"),
                    "A última migration aplicada deveria ser a V4"
            );
        }
    }

    @Test
    @DisplayName("Deve possuir índice único para o prontuário do paciente")
    void devePossuirIndiceUnicoParaProntuario() throws SQLException {

        String sql = """
                SELECT COUNT(*)
                FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                  AND table_name = 'paciente'
                  AND column_name = 'prontuario'
                  AND non_unique = 0
                """;

        try (
                Connection connection = MYSQL.createConnection("");
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(sql)
        ) {

            assertTrue(resultSet.next());

            int quantidadeIndicesUnicos = resultSet.getInt(1);

            assertTrue(
                    quantidadeIndicesUnicos >= 1,
                    "A coluna paciente.prontuario deveria possuir índice único"
            );
        }
    }

    @Test
    @DisplayName("Deve possuir índice único para o e-mail do usuário")
    void devePossuirIndiceUnicoParaEmail() throws SQLException {

        String sql = """
                SELECT COUNT(*)
                FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                  AND table_name = 'usuario'
                  AND column_name = 'email'
                  AND non_unique = 0
                """;

        try (
                Connection connection = MYSQL.createConnection("");
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(sql)
        ) {

            assertTrue(resultSet.next());

            int quantidadeIndicesUnicos = resultSet.getInt(1);

            assertTrue(
                    quantidadeIndicesUnicos >= 1,
                    "A coluna usuario.email deveria possuir índice único"
            );
        }
    }
}