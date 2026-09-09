package br.com.cervicare.atendimento.domain;

import br.com.cervicare.atendimento.domain.enums.ResultadoPcr;
import br.com.cervicare.atendimento.domain.enums.TipoHpv;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pcr_dna_hpv")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idExame")
public class PcrDnaHpv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exame")
    private Integer idExame;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultadoPcr resultado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_hpv")
    private TipoHpv tipoHpv;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "data_edicao", nullable = false)
    private LocalDateTime dataEdicao;
}