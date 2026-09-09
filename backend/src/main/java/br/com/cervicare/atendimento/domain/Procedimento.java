package br.com.cervicare.atendimento.domain;

import br.com.cervicare.atendimento.domain.enums.Margem;
import br.com.cervicare.atendimento.domain.enums.ResultadoProcedimento;
import br.com.cervicare.atendimento.domain.enums.TipoProcedimento;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "procedimento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idProcedimento")
public class Procedimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_procedimento")
    private Integer idProcedimento;

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
    private TipoProcedimento tipo;

    @Column(name = "qt_fragmento", nullable = false)
    private Integer qtFragmento;

    @Enumerated(EnumType.STRING)
    @Column(name = "margem_endocervical")
    private Margem margemEndocervical;

    @Enumerated(EnumType.STRING)
    @Column(name = "margem_ectocervical")
    private Margem margemEctocervical;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultadoProcedimento resultado;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "data_edicao", nullable = false)
    private LocalDateTime dataEdicao;
}