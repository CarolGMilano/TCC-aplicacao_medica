package br.com.cervicare.dashboard.service;

import br.com.cervicare.atendimento.repository.ColposcopiaRepository;
import br.com.cervicare.atendimento.repository.ProcedimentoRepository;
import br.com.cervicare.dashboard.dto.AlertaAtrasoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaService {

    private final ColposcopiaRepository colposcopiaRepository;
    private final ProcedimentoRepository procedimentoRepository;

    public List<AlertaAtrasoDTO> listarVerETratarAtrasados() {
        LocalDate dataLimite = LocalDate.now().minusMonths(2);
        
        return colposcopiaRepository.findVerETratarAtrasados(dataLimite).stream()
                .map(c -> AlertaAtrasoDTO.builder()
                        .idPaciente(c.getPaciente().getIdPaciente())
                        .nome(c.getPaciente().getNome())
                        .prontuario(c.getPaciente().getProntuario())
                        .status(c.getPaciente().getStatus().name())
                        .diasAtraso(ChronoUnit.DAYS.between(c.getDataRegistro(), LocalDate.now()))
                        .tipoAlerta("Ver e Tratar")
                        .build())
                .toList();
    }

    public List<AlertaAtrasoDTO> listarPosProcedimentoAtrasados() {
        LocalDate dataLimite = LocalDate.now().minusMonths(3);
        
        return procedimentoRepository.findPosProcedimentoAtrasados(dataLimite).stream()
                .map(p -> AlertaAtrasoDTO.builder()
                        .idPaciente(p.getPaciente().getIdPaciente())
                        .nome(p.getPaciente().getNome())
                        .prontuario(p.getPaciente().getProntuario())
                        .status(p.getPaciente().getStatus().name())
                        .diasAtraso(ChronoUnit.DAYS.between(p.getDataRegistro(), LocalDate.now()))
                        .tipoAlerta(p.getTipo().name())
                        .build())
                .toList();
    }
}