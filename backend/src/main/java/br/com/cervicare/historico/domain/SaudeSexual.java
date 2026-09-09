package br.com.cervicare.historico.domain;

import br.com.cervicare.historico.domain.enums.MetodoContraceptivo;
import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saude_sexual")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idDados")
public class SaudeSexual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dados")
    private Integer idDados;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Column(nullable = false)
    private Integer sexarca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoContraceptivo mac;

    @Column(name = "num_parceiros", nullable = false)
    private Integer numParceiros;

    @Column(nullable = false)
    private Boolean vvs;
}