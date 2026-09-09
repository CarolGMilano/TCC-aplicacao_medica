package br.com.cervicare.historico.domain;

import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dados_gineco_obstetricos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idDados")
public class DadosGinecoObstetricos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dados")
    private Integer idDados;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "num_gestacao", nullable = false)
    private Integer numGestacao;

    @Column(name = "num_parto_normal", nullable = false)
    private Integer numPartoNormal;

    @Column(name = "num_cesariana", nullable = false)
    private Integer numCesariana;

    @Column(name = "num_aborto", nullable = false)
    private Integer numAborto;

    @Column(nullable = false)
    private Integer menarca;

    private Integer menopausa;
}