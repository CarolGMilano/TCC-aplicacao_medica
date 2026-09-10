package br.com.cervicare.paciente.domain;

import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "paciente",
        indexes = {
                @Index(name = "idx_paciente_nome", columnList = "nome"),
                @Index(name = "idx_paciente_status", columnList = "status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idPaciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer idPaciente;

    @Column(nullable = false, length = 45)
    private String nome;

    @Column(name = "data_nasc", nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false, length = 50, unique = true)
    private String prontuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPaciente status;

    @Column(nullable = false)
    private Boolean ativo = true;
}