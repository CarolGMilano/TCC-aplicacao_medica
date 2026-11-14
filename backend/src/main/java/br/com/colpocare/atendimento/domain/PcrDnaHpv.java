// Importe as anotações do Jakarta Persistence (JPA) e Lombok
package br.com.colpocare.atendimento.domain;

import br.com.colpocare.atendimento.domain.enums.ResultadoPcr;
import br.com.colpocare.atendimento.domain.enums.TipoHpv;
import br.com.colpocare.medico.domain.Medico;
import br.com.colpocare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    // NOVO MAPEAMENTO 1:N
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pcr_dna_hpv_tipo", joinColumns = @JoinColumn(name = "id_pcr"))
    @Enumerated(EnumType.STRING)
    @Column(name = "hpv_tipo")
    private List<TipoHpv> tiposHpv;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "data_edicao", nullable = false)
    private LocalDateTime dataEdicao;
}