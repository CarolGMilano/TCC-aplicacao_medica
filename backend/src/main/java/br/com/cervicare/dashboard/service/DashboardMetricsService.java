package br.com.cervicare.dashboard.service;

import br.com.cervicare.dashboard.dto.DistribuicaoEtariaDTO;
import br.com.cervicare.dashboard.dto.DistribuicaoIstDTO;
import br.com.cervicare.dashboard.dto.HistoricoIndicadoresDTO;
import br.com.cervicare.dashboard.dto.KpiResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardMetricsService {

    private final JdbcTemplate jdbcTemplate;

    public KpiResponseDTO obterKpisGerais() {
        Long pacientes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM paciente", Long.class);
        Long profissionais = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM medico", Long.class);
        
        String sqlRegistros = """
                SELECT 
                    (SELECT COUNT(*) FROM colposcopia) + 
                    (SELECT COUNT(*) FROM citologia) + 
                    (SELECT COUNT(*) FROM pcr_dna_hpv) + 
                    (SELECT COUNT(*) FROM procedimento)
                """;
        Long registros = jdbcTemplate.queryForObject(sqlRegistros, Long.class);

        return KpiResponseDTO.builder()
                .totalPacientes(pacientes != null ? pacientes : 0L)
                .totalProfissionais(profissionais != null ? profissionais : 0L)
                .totalRegistros(registros != null ? registros : 0L)
                .build();
    }

    public List<DistribuicaoIstDTO> obterDistribuicaoIst() {
        String sql = """
                SELECT ist, COUNT(*) as quantidade 
                FROM historico_ist 
                GROUP BY ist 
                ORDER BY quantidade DESC
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> DistribuicaoIstDTO.builder()
                .ist(rs.getString("ist"))
                .quantidade(rs.getLong("quantidade"))
                .build());
    }

    public List<DistribuicaoEtariaDTO> obterDistribuicaoEtaria() {
        String sql = """
                SELECT 
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) <= 19 THEN 1 ELSE 0 END) as ate_19,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 20 AND 24 THEN 1 ELSE 0 END) as de_20_24,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 25 AND 29 THEN 1 ELSE 0 END) as de_25_29,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 30 AND 39 THEN 1 ELSE 0 END) as de_30_39,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 40 AND 49 THEN 1 ELSE 0 END) as de_40_49,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 50 AND 59 THEN 1 ELSE 0 END) as de_50_59,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 60 AND 64 THEN 1 ELSE 0 END) as de_60_64,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) BETWEEN 65 AND 69 THEN 1 ELSE 0 END) as de_65_69,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE()) >= 70 THEN 1 ELSE 0 END) as acima_70
                FROM paciente
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> List.of(
                new DistribuicaoEtariaDTO("≤19", rs.getLong("ate_19"), false),
                new DistribuicaoEtariaDTO("20–24", rs.getLong("de_20_24"), false),
                new DistribuicaoEtariaDTO("25–29", rs.getLong("de_25_29"), true),
                new DistribuicaoEtariaDTO("30–39", rs.getLong("de_30_39"), true),
                new DistribuicaoEtariaDTO("40–49", rs.getLong("de_40_49"), true),
                new DistribuicaoEtariaDTO("50–59", rs.getLong("de_50_59"), true),
                new DistribuicaoEtariaDTO("60–64", rs.getLong("de_60_64"), true),
                new DistribuicaoEtariaDTO("65–69", rs.getLong("de_65_69"), false),
                new DistribuicaoEtariaDTO("≥70", rs.getLong("acima_70"), false)
        ));
    }

    public HistoricoIndicadoresDTO obterHistoricoIndicadores() {
        Long totalColposcopias = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM colposcopia", Long.class);
        Long indicacoesVt = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM colposcopia WHERE ver_e_tratar = 1", Long.class);
        
        Long pacientesComRecidiva = jdbcTemplate.queryForObject("SELECT COUNT(DISTINCT id_paciente) FROM colposcopia WHERE recidiva = 1", Long.class);
        Long totalPacientesAvaliadas = jdbcTemplate.queryForObject("SELECT COUNT(DISTINCT id_paciente) FROM colposcopia", Long.class);

        totalColposcopias = totalColposcopias != null ? totalColposcopias : 0L;
        indicacoesVt = indicacoesVt != null ? indicacoesVt : 0L;
        pacientesComRecidiva = pacientesComRecidiva != null ? pacientesComRecidiva : 0L;
        totalPacientesAvaliadas = totalPacientesAvaliadas != null ? totalPacientesAvaliadas : 0L;

        Long pacientesSemRecidiva = totalPacientesAvaliadas - pacientesComRecidiva;
        Double percentualVt = totalColposcopias > 0 ? (indicacoesVt.doubleValue() / totalColposcopias) * 100 : 0.0;
        Double percentualRecidiva = totalPacientesAvaliadas > 0 ? (pacientesComRecidiva.doubleValue() / totalPacientesAvaliadas) * 100 : 0.0;

        return HistoricoIndicadoresDTO.builder()
                .totalColposcopias(totalColposcopias)
                .indicacoesVerETratar(indicacoesVt)
                .percentualVerETratar(Math.round(percentualVt * 10.0) / 10.0)
                .pacientesComRecidiva(pacientesComRecidiva)
                .pacientesSemRecidiva(pacientesSemRecidiva)
                .percentualRecidiva(Math.round(percentualRecidiva * 10.0) / 10.0)
                .build();
    }
}