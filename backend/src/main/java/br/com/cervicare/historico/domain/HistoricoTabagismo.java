package br.com.cervicare.historico.domain;

import br.com.cervicare.historico.domain.enums.StatusFumante;
import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "historico_tabagismo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idHistorico")
public class HistoricoTabagismo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico")
    private Integer idHistorico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "cigarros_dia")
    private Integer cigarrosDia;

    @Column(name = "idade_inicio")
    private Integer idadeInicio;

    @Column(name = "idade_fim")
    private Integer idadeFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusFumante fumante;
}