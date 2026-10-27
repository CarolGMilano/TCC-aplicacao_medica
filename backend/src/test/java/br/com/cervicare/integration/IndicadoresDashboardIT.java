package br.com.cervicare.integration;

import br.com.cervicare.auth.domain.Usuario;
import br.com.cervicare.auth.repository.UsuarioRepository;
import br.com.cervicare.auth.service.TokenService;
import br.com.cervicare.dashboard.dto.IndicadoresExamesDTO;
import br.com.cervicare.dashboard.dto.PacienteSemExameDTO;
import br.com.cervicare.dashboard.dto.PacientesAtendidasDTO;
import br.com.cervicare.dashboard.dto.PacientesPorSituacaoDTO;
import br.com.cervicare.dashboard.dto.ResultadoQuantidadeDTO;
import br.com.cervicare.dashboard.dto.SituacaoQuantidadeDTO;
import br.com.cervicare.dashboard.service.IndicadoresService;
import br.com.cervicare.security.MockMvcTestConfig;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Import(MockMvcTestConfig.class)
@DisplayName("CerviCare - Indicadores do dashboard mobile")
class IndicadoresDashboardIT extends AbstractIntegrationTest {

    @Autowired
    private IndicadoresService indicadoresService;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    private final LocalDate hoje = LocalDate.now();
    private int medico;

    // Base: 6 pacientes. P4 está inativa e não deve contar em nada.
    private int p1, p2, p3, p6;

    @BeforeEach
    void prepararDados() {
        limparDados();
        medico = garantirMedico();

        p1 = paciente("P1", "EM_INVESTIGACAO", true);
        p2 = paciente("P2", "AGUARDANDO_PROCEDIMENTO", true);
        p3 = paciente("P3", "ALTA", true);
        int p4 = paciente("P4", "EM_TRATAMENTO", false);
        int p5 = paciente("P5", "POS_PROCEDIMENTO", true);
        p6 = paciente("P6", "EM_TRATAMENTO", true);

        consulta(p1, hoje);
        citologia(p1, hoje, "ASC_US");
        pcr(p1, hoje, "POSITIVO", "HPV_16", "HPV_6");
        colposcopia(p1, hoje, true);

        citologia(p2, hoje.minusYears(3), "NILM");
        pcr(p2, hoje, "POSITIVO", "HPV_6");

        consulta(p4, hoje);
        citologia(p4, hoje, "HSIL");

        pcr(p5, hoje, "NEGATIVO");

        citologia(p6, hoje.minusYears(2), "LSIL");
    }

    @Test
    @DisplayName("conta pacientes distintas atendidas, sem as inativas")
    void pacientesAtendidas() {
        PacientesAtendidasDTO atendidas = indicadoresService.obterPacientesAtendidas();

        assertThat(atendidas.hoje()).isEqualTo(3L);
        assertThat(atendidas.semana()).isEqualTo(3L);
        assertThat(atendidas.mes()).isEqualTo(3L);
    }

    @Test
    @DisplayName("devolve os seis status, com zero nos vazios")
    void pacientesPorSituacao() {
        PacientesPorSituacaoDTO situacao = indicadoresService.obterPacientesPorSituacao();
        Map<String, Long> porStatus = situacao.situacoes().stream()
                .collect(Collectors.toMap(SituacaoQuantidadeDTO::status, SituacaoQuantidadeDTO::total));

        assertThat(situacao.total()).isEqualTo(5L);
        assertThat(situacao.situacoes()).hasSize(6);
        assertThat(porStatus)
                .containsEntry("EM_INVESTIGACAO", 1L)
                .containsEntry("EM_TRATAMENTO", 1L)
                .containsEntry("AGUARDANDO_PROCEDIMENTO", 1L)
                .containsEntry("POS_PROCEDIMENTO", 1L)
                .containsEntry("ACOMPANHAMENTO_PREVENTIVO", 0L)
                .containsEntry("ALTA", 1L);
    }

    @Test
    @DisplayName("calcula os indicadores de exames do mês")
    void indicadoresExames() {
        IndicadoresExamesDTO exames = indicadoresService.obterIndicadoresExames(YearMonth.now());

        // Citologia de P1, PCR de P1, P2 e P5 e colposcopia de P1.
        assertThat(exames.examesNoMes()).isEqualTo(5L);
        assertThat(exames.examesMesAnterior()).isZero();
        assertThat(exames.variacaoPercentual()).isNull();
        assertThat(exames.citologiaPorResultado())
                .containsExactly(new ResultadoQuantidadeDTO("ASC_US", 1L));
        assertThat(exames.pcrPorResultado().negativo()).isEqualTo(1L);
        assertThat(exames.pcrPorResultado().hpv16ou18()).isEqualTo(1L);
        assertThat(exames.pcrPorResultado().outros()).isEqualTo(1L);
        assertThat(exames.verETratarRealizados()).isEqualTo(1L);
    }

    @Test
    @DisplayName("calcula a variação em relação ao mês anterior")
    void variacaoMesAnterior() {
        YearMonth anterior = YearMonth.now().minusMonths(1);
        citologia(p3, anterior.atDay(10), "NILM");
        citologia(p3, anterior.atDay(11), "NILM");

        IndicadoresExamesDTO exames = indicadoresService.obterIndicadoresExames(null);

        assertThat(exames.mes()).isEqualTo(YearMonth.now().toString());
        assertThat(exames.examesMesAnterior()).isEqualTo(2L);
        assertThat(exames.variacaoPercentual()).isEqualTo(150.0);
    }

    @Test
    @DisplayName("lista quem está sem exame no prazo, começando por quem nunca fez")
    void pacientesSemExame() {
        List<PacienteSemExameDTO> semExame = indicadoresService.buscarPacientesSemExame(1);

        assertThat(semExame).extracting(PacienteSemExameDTO::idPaciente)
                .containsExactly(p3, p6);
        assertThat(semExame.get(0).ultimoExame()).isNull();
        assertThat(semExame.get(1).ultimoExame()).isEqualTo(hoje.minusYears(2));
        assertThat(semExame).extracting(PacienteSemExameDTO::idPaciente).doesNotContain(p1, p2);
    }

    @Test
    @DisplayName("expõe os indicadores por HTTP, só com token")
    void endpoints() throws Exception {
        mockMvc.perform(get("/api/dashboard/exames")).andExpect(status().isUnauthorized());

        String email = jdbc.queryForObject(
                "SELECT u.email FROM usuario u JOIN medico m ON m.id_usuario = u.id_usuario WHERE m.id_medico = ?",
                String.class, medico);
        String token = "Bearer " + tokenService.gerarToken(
                (Usuario) usuarioRepository.findByEmailIgnoreCase(email).orElseThrow());

        mockMvc.perform(get("/api/dashboard/pacientes-atendidas").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hoje").value(3))
                .andExpect(jsonPath("$.semana").value(3))
                .andExpect(jsonPath("$.mes").value(3));

        mockMvc.perform(get("/api/dashboard/pacientes-por-situacao").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(5))
                .andExpect(jsonPath("$.situacoes", hasSize(6)))
                .andExpect(jsonPath("$.situacoes[0].status").value("EM_INVESTIGACAO"));

        mockMvc.perform(get("/api/dashboard/exames")
                        .param("mes", YearMonth.now().toString())
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mes").value(YearMonth.now().toString()))
                .andExpect(jsonPath("$.examesNoMes").value(5))
                .andExpect(jsonPath("$.variacaoPercentual").value(nullValue()))
                .andExpect(jsonPath("$.citologiaPorResultado[0].resultado").value("ASC_US"))
                .andExpect(jsonPath("$.pcrPorResultado.hpv16ou18").value(1))
                .andExpect(jsonPath("$.verETratarRealizados").value(1));

        mockMvc.perform(get("/api/dashboard/pacientes/sem-exame")
                        .param("anos", "1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nome").value("P3"))
                .andExpect(jsonPath("$[0].ultimoExame").value(nullValue()))
                .andExpect(jsonPath("$[1].nome").value("P6"));
    }

    // O MySQL do teste é compartilhado: sem limpar, os registros presos ao
    // médico impedem os outros testes de apagá-lo.
    @AfterEach
    void limparDados() {
        for (String tabela : List.of("pcr_dna_hpv_tipo", "pcr_dna_hpv", "citologia", "colposcopia",
                "procedimento", "consulta", "historico_ist", "historico_tabagismo",
                "saude_sexual", "dados_gineco_obstetricos", "paciente")) {
            jdbc.update("DELETE FROM " + tabela);
        }
    }

    // ---------- dados ----------

    private int garantirMedico() {
        List<Integer> ids = jdbc.queryForList("SELECT id_medico FROM medico", Integer.class);
        if (!ids.isEmpty()) {
            return ids.get(0);
        }
        int usuario = inserir("INSERT INTO usuario (email, senha, salt, ativo, tipo) VALUES (?, ?, ?, ?, ?)",
                "indicadores@cervicare.test", "x", "BCrypt", true, "MEDICO");
        return inserir("INSERT INTO medico (id_usuario, nome, crm, especialidade) VALUES (?, ?, ?, ?)",
                usuario, "Teste", "CRM-IT-1", "Ginecologia");
    }

    private int paciente(String nome, String status, boolean ativo) {
        return inserir("INSERT INTO paciente (nome, data_nasc, prontuario, status, ativo) VALUES (?, ?, ?, ?, ?)",
                nome, LocalDate.of(1985, 1, 1), "PRT-" + nome, status, ativo);
    }

    private void consulta(int paciente, LocalDate data) {
        jdbc.update("INSERT INTO consulta (id_paciente, id_medico, data_hora, observacao) VALUES (?, ?, ?, ?)",
                paciente, medico, data.atTime(10, 0), "Consulta");
    }

    private void citologia(int paciente, LocalDate data, String resultado) {
        jdbc.update("""
                INSERT INTO citologia (id_paciente, data_registro, resultado, id_medico, data_edicao)
                VALUES (?, ?, ?, ?, NOW())
                """, paciente, data, resultado, medico);
    }

    private void pcr(int paciente, LocalDate data, String resultado, String... tipos) {
        int exame = inserir("""
                INSERT INTO pcr_dna_hpv (id_paciente, data_registro, resultado, id_medico, data_edicao)
                VALUES (?, ?, ?, ?, NOW())
                """, paciente, data, resultado, medico);
        for (String tipo : tipos) {
            jdbc.update("INSERT INTO pcr_dna_hpv_tipo (hpv_tipo, id_pcr) VALUES (?, ?)", tipo, exame);
        }
    }

    private void colposcopia(int paciente, LocalDate data, boolean verETratar) {
        jdbc.update("""
                INSERT INTO colposcopia (id_paciente, data_registro, estrogenizacao, jec, zt,
                                         ver_e_tratar, id_medico, data_edicao)
                VALUES (?, ?, true, '0', 'ZT_1', ?, ?, NOW())
                """, paciente, data, verETratar, medico);
    }

    private int inserir(String sql, Object... valores) {
        GeneratedKeyHolder chave = new GeneratedKeyHolder();
        jdbc.update(conexao -> {
            PreparedStatement ps = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            for (int i = 0; i < valores.length; i++) {
                ps.setObject(i + 1, valores[i]);
            }
            return ps;
        }, chave);
        return chave.getKey().intValue();
    }
}
