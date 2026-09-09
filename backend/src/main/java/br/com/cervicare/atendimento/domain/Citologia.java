package br.com.cervicare.atendimento.domain;

import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "citologia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idExame")
public class Citologia {

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

    @Column(nullable = false)
    private String resultado; // Usando String para suportar a migration inicial 'A definir' e facilitar futura expansão

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "data_edicao", nullable = false)
    private LocalDateTime dataEdicao;
}