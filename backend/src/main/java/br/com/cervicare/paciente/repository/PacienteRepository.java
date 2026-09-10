package br.com.cervicare.paciente.repository;

import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    @Query("""
            SELECT p
            FROM Paciente p
            WHERE p.ativo = true
              AND (LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
               OR LOWER(p.prontuario) = LOWER(:busca))
            """)
    Page<Paciente> buscarPorNomeOuProntuarioAtivos(
            @Param("busca") String busca,
            Pageable pageable
    );

    Page<Paciente> findByStatusAndAtivoTrue(
            StatusPaciente status,
            Pageable pageable
    );

    Page<Paciente> findByStatusAndNomeContainingIgnoreCaseAndAtivoTrue(
            StatusPaciente status,
            String nome,
            Pageable pageable
    );

    Page<Paciente> findByAtivoTrue(Pageable pageable);

    Optional<Paciente> findByIdPacienteAndAtivoTrue(Integer idPaciente);

    boolean existsByProntuarioIgnoreCase(String prontuario);

    boolean existsByProntuarioIgnoreCaseAndIdPacienteNot(
            String prontuario,
            Integer idPaciente
    );
}