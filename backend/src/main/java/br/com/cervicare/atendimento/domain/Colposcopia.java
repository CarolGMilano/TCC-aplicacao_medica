package br.com.cervicare.atendimento.domain;

import br.com.cervicare.atendimento.domain.enums.ClassificacaoColposcopia;
import br.com.cervicare.atendimento.domain.enums.GrauLesao;
import br.com.cervicare.atendimento.domain.enums.ZonaTransformacao;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "colposcopia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idColposcopia")
public class Colposcopia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_colposcopia")
    private Integer idColposcopia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @Column(nullable = false)
    private Boolean estrogenizacao;

    @Column(nullable = false)
    private String jec; // Mapeado como String devido aos caracteres especiais no MySQL ('-1', '-2', etc)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ZonaTransformacao zt;

    private Boolean lesao;
    private Boolean recidiva;

    @Enumerated(EnumType.STRING)
    @Column(name = "grau_lesao")
    private GrauLesao grauLesao;

    @Enumerated(EnumType.STRING)
    private ClassificacaoColposcopia classificacao;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "ver_e_tratar", nullable = false)
    private Boolean verETratar;

    @Column(name = "ver_e_tratar_motivo", columnDefinition = "TEXT")
    private String verETratarMotivo;

    @Column(name = "data_edicao", nullable = false)
    private LocalDateTime dataEdicao;
}