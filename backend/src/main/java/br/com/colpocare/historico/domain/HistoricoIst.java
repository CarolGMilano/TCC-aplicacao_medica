package br.com.colpocare.historico.domain;

import br.com.colpocare.historico.domain.enums.TipoIst;
import br.com.colpocare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "historico_ist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idHistorico")
public class HistoricoIst {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico")
    private Integer idHistorico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoIst ist;

    @Column(name = "condiloma_hpv")
    private Boolean condilomaHpv;
}