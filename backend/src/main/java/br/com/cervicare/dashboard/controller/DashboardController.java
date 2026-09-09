package br.com.cervicare.dashboard.controller;

import br.com.cervicare.dashboard.dto.*;
import br.com.cervicare.dashboard.service.AlertaService;
import br.com.cervicare.dashboard.service.DashboardMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}