package br.com.cervicare.dashboard.service;

import br.com.cervicare.dashboard.dto.IndicadoresExamesDTO;
import br.com.cervicare.dashboard.dto.PacienteSemExameDTO;
import br.com.cervicare.dashboard.dto.PacientesAtendidasDTO;
import br.com.cervicare.dashboard.dto.PacientesPorSituacaoDTO;
import br.com.cervicare.dashboard.dto.PcrPorResultadoDTO;
import br.com.cervicare.dashboard.dto.ResultadoQuantidadeDTO;
import br.com.cervicare.dashboard.dto.SituacaoQuantidadeDTO;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Indicadores do dashboard mobile (abas "Indicadores" e "Exames"). Só contam
// pacientes ativas, como os outros indicadores do dashboard.
@Service
@RequiredArgsConstructor
public class IndicadoresService {

    private final JdbcTemplate jdbcTemplate;

    // Pacientes distintas com consulta ou qualquer exame entre a data inicial
    // e hoje: hoje, semana atual (de segunda até hoje) e mês atual.
    public PacientesAtendidasDTO obterPacientesAtendidas() {
        LocalDate hoje = LocalDate.now();
        return PacientesAtendidasDTO.builder()
                .hoje(contarAtendidasDesde(hoje, hoje))
                .semana(contarAtendidasDesde(hoje.with(DayOfWeek.MONDAY), hoje))
                .mes(contarAtendidasDesde(hoje.withDayOfMonth(1), hoje))
                .build();
    }

    private Long contarAtendidasDesde(LocalDate inicio, LocalDate fim) {
        String sql = """
                SELECT COUNT(DISTINCT r.id_paciente)
                FROM (
                    SELECT id_paciente, DATE(data_hora) AS data FROM consulta
                    UNION ALL SELECT id_paciente, data_registro FROM citologia
                    UNION ALL SELECT id_paciente, data_registro FROM pcr_dna_hpv
                    UNION ALL SELECT id_paciente, data_registro FROM colposcopia
                    UNION ALL SELECT id_paciente, data_registro FROM procedimento
                ) r
                JOIN paciente p ON p.id_paciente = r.id_paciente
                WHERE p.ativo = true AND r.data BETWEEN ? AND ?
                """;
        Long total = jdbcTemplate.queryForObject(sql, Long.class, inicio, fim);
        return total != null ? total : 0L;
    }

    // Os seis status sempre aparecem, com zero quando não há pacientes.
    public PacientesPorSituacaoDTO obterPacientesPorSituacao() {
        Map<String, Long> porStatus = new HashMap<>();
        jdbcTemplate.query(
                "SELECT status, COUNT(*) AS total FROM paciente WHERE ativo = true GROUP BY status",
                rs -> {
                    porStatus.put(rs.getString("status"), rs.getLong("total"));
                });

        List<SituacaoQuantidadeDTO> situacoes = Arrays.stream(StatusPaciente.values())
                .map(status -> new SituacaoQuantidadeDTO(
                        status.name(), porStatus.getOrDefault(status.name(), 0L)))
                .toList();
        long total = situacoes.stream().mapToLong(SituacaoQuantidadeDTO::total).sum();

        return PacientesPorSituacaoDTO.builder()
                .total(total)
                .situacoes(situacoes)
                .build();
    }

    // Indicadores de exames do mês informado (padrão: mês atual). "Exames"
    // são citologias, PCR DNA HPV e colposcopias.
    public IndicadoresExamesDTO obterIndicadoresExames(YearMonth mes) {
        YearMonth referencia = mes != null ? mes : YearMonth.now();
        LocalDate inicio = referencia.atDay(1);
        LocalDate fim = referencia.atEndOfMonth();

        long examesNoMes = contarExames(inicio, fim);
        YearMonth anterior = referencia.minusMonths(1);
        long examesMesAnterior = contarExames(anterior.atDay(1), anterior.atEndOfMonth());
        Double variacao = examesMesAnterior > 0
                ? Math.round(((examesNoMes - examesMesAnterior) * 100.0 / examesMesAnterior) * 10.0) / 10.0
                : null;

        List<ResultadoQuantidadeDTO> citologia = jdbcTemplate.query("""
                SELECT c.resultado, COUNT(*) AS total
                FROM citologia c
                JOIN paciente p ON p.id_paciente = c.id_paciente
                WHERE p.ativo = true AND c.data_registro BETWEEN ? AND ?
                GROUP BY c.resultado
                ORDER BY total DESC
                """,
                (rs, rowNum) -> new ResultadoQuantidadeDTO(rs.getString("resultado"), rs.getLong("total")),
                inicio, fim);

        // HPV 16 ou 18 tem prioridade: um PCR com 16 e 6 conta como "hpv16ou18".
        PcrPorResultadoDTO pcr = jdbcTemplate.queryForObject("""
                SELECT
                    SUM(CASE WHEN x.resultado = 'NEGATIVO' THEN 1 ELSE 0 END) AS negativo,
                    SUM(CASE WHEN x.resultado = 'POSITIVO' AND x.alto_risco = 1 THEN 1 ELSE 0 END) AS hpv16ou18,
                    SUM(CASE WHEN x.resultado = 'POSITIVO' AND x.alto_risco = 0 THEN 1 ELSE 0 END) AS outros
                FROM (
                    SELECT e.resultado,
                           EXISTS (SELECT 1 FROM pcr_dna_hpv_tipo t
                                   WHERE t.id_pcr = e.id_exame
                                     AND t.hpv_tipo IN ('HPV_16', 'HPV_18')) AS alto_risco
                    FROM pcr_dna_hpv e
                    JOIN paciente p ON p.id_paciente = e.id_paciente
                    WHERE p.ativo = true AND e.data_registro BETWEEN ? AND ?
                ) x
                """,
                (rs, rowNum) -> PcrPorResultadoDTO.builder()
                        .negativo(rs.getLong("negativo"))
                        .hpv16ou18(rs.getLong("hpv16ou18"))
                        .outros(rs.getLong("outros"))
                        .build(),
                inicio, fim);

        Long verETratar = jdbcTemplate.queryForObject("""
                SELECT COUNT(*)
                FROM colposcopia c
                JOIN paciente p ON p.id_paciente = c.id_paciente
                WHERE p.ativo = true AND c.ver_e_tratar = 1 AND c.data_registro BETWEEN ? AND ?
                """, Long.class, inicio, fim);

        return IndicadoresExamesDTO.builder()
                .mes(referencia.toString())
                .examesNoMes(examesNoMes)
                .examesMesAnterior(examesMesAnterior)
                .variacaoPercentual(variacao)
                .citologiaPorResultado(citologia)
                .pcrPorResultado(pcr)
                .verETratarRealizados(verETratar != null ? verETratar : 0L)
                .build();
    }

    private long contarExames(LocalDate inicio, LocalDate fim) {
        String sql = """
                SELECT COUNT(*)
                FROM (
                    SELECT id_paciente, data_registro FROM citologia
                    UNION ALL SELECT id_paciente, data_registro FROM pcr_dna_hpv
                    UNION ALL SELECT id_paciente, data_registro FROM colposcopia
                ) e
                JOIN paciente p ON p.id_paciente = e.id_paciente
                WHERE p.ativo = true AND e.data_registro BETWEEN ? AND ?
                """;
        Long total = jdbcTemplate.queryForObject(sql, Long.class, inicio, fim);
        return total != null ? total : 0L;
    }

    // Pacientes cuja última citologia ou PCR é anterior a hoje menos "anos",
    // ou que nunca fizeram exame (essas primeiro).
    public List<PacienteSemExameDTO> buscarPacientesSemExame(int anos) {
        LocalDate limite = LocalDate.now().minusYears(anos);
        String sql = """
                SELECT p.id_paciente, p.nome, p.prontuario, u.ultimo_exame
                FROM paciente p
                LEFT JOIN (
                    SELECT id_paciente, MAX(data_registro) AS ultimo_exame
                    FROM (
                        SELECT id_paciente, data_registro FROM citologia
                        UNION ALL SELECT id_paciente, data_registro FROM pcr_dna_hpv
                    ) e
                    GROUP BY id_paciente
                ) u ON u.id_paciente = p.id_paciente
                WHERE p.ativo = true AND (u.ultimo_exame IS NULL OR u.ultimo_exame < ?)
                ORDER BY u.ultimo_exame IS NOT NULL, u.ultimo_exame, p.nome
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new PacienteSemExameDTO(
                rs.getInt("id_paciente"),
                rs.getString("nome"),
                rs.getString("prontuario"),
                rs.getObject("ultimo_exame", LocalDate.class)
        ), limite);
    }
}
