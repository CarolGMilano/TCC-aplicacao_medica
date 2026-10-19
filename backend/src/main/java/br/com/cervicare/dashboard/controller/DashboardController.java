package br.com.cervicare.dashboard.controller;

import br.com.cervicare.dashboard.dto.*;
import br.com.cervicare.dashboard.service.AlertaService;
import br.com.cervicare.dashboard.service.DashboardMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AlertaService alertaService;
    private final DashboardMetricsService metricsService;

    @GetMapping("/alertas/ver-e-tratar")
    public ResponseEntity<List<AlertaAtrasoDTO>> listarAlertasVerETratar() {
        return ResponseEntity.ok(alertaService.listarVerETratarAtrasados());
    }

    @GetMapping("/alertas/pos-procedimento")
    public ResponseEntity<List<AlertaAtrasoDTO>> listarAlertasPosProcedimento() {
        return ResponseEntity.ok(alertaService.listarPosProcedimentoAtrasados());
    }

    @GetMapping("/kpis")
    public ResponseEntity<KpiResponseDTO> obterKpisGerais() {
        return ResponseEntity.ok(metricsService.obterKpisGerais());
    }

    @GetMapping("/distribuicao-ist")
    public ResponseEntity<List<DistribuicaoIstDTO>> obterDistribuicaoIst() {
        return ResponseEntity.ok(metricsService.obterDistribuicaoIst());
    }

    @GetMapping("/distribuicao-etaria")
    public ResponseEntity<List<DistribuicaoEtariaDTO>> obterDistribuicaoEtaria() {
        return ResponseEntity.ok(metricsService.obterDistribuicaoEtaria());
    }

    @GetMapping("/historico-indicadores")
    public ResponseEntity<HistoricoIndicadoresDTO> obterHistoricoIndicadores() {
        return ResponseEntity.ok(metricsService.obterHistoricoIndicadores());
    }

    // ==========================================
    // NOVOS ENDPOINTS DE DRILL-DOWN (LISTAGENS)
    // ==========================================

    @GetMapping("/pacientes/faixa-etaria")
    public ResponseEntity<List<PacienteResumoDTO>> listarPorFaixaEtaria(@RequestParam String faixa) {
        int min = 0;
        int max = 200;

        // Trata a string enviada pelo front (ex: "30-39" ou "≥70")
        String faixaLimpa = faixa.replace("≥", "").replace("≤", "").trim();

        if (faixa.contains("≥") || faixa.contains("+") || faixaLimpa.equals("70")) {
            min = 70;
        } else if (faixa.contains("≤") || faixaLimpa.equals("19")) {
            max = 19;
        } else if (faixaLimpa.contains("–") || faixaLimpa.contains("-")) {
            String separador = faixaLimpa.contains("–") ? "–" : "-";
            String[] partes = faixaLimpa.split(separador);
            min = Integer.parseInt(partes[0].trim());
            max = Integer.parseInt(partes[1].trim());
        }

        return ResponseEntity.ok(metricsService.buscarPacientesPorFaixaEtaria(min, max));
    }

    @GetMapping("/pacientes/ist")
    public ResponseEntity<List<PacienteResumoDTO>> listarPorIst(@RequestParam String ist) {
        return ResponseEntity.ok(metricsService.buscarPacientesPorIst(ist));
    }

    @GetMapping("/pacientes/recidiva")
    public ResponseEntity<List<PacienteResumoDTO>> listarPorRecidiva(@RequestParam boolean status) {
        return ResponseEntity.ok(metricsService.buscarPacientesPorRecidiva(status));
    }

    @GetMapping("/pacientes/ver-e-tratar")
    public ResponseEntity<List<PacienteResumoDTO>> listarPorVerETratar(@RequestParam("status") boolean status) {
        return ResponseEntity.ok(metricsService.buscarPacientesPorVerETratar(status));
    }
}