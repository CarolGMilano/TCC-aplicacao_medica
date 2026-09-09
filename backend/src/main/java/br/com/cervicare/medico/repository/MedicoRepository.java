package br.com.cervicare.medico.repository;

import br.com.cervicare.auth.domain.enums.TipoUsuario;
import br.com.cervicare.medico.domain.Medico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Integer> {
    
    Optional<Medico> findByUsuario_IdUsuario(Integer idUsuario);

    boolean existsByCrmIgnoreCase(String crm);

    boolean existsByCrmIgnoreCaseAndIdMedicoNot(String crm, Integer idMedico);

    @EntityGraph(attributePaths = {"usuario"})
    @Query("""
            SELECT m FROM Medico m JOIN m.usuario u 
            WHERE (:busca IS NULL OR LOWER(m.nome) LIKE LOWER(CONCAT('%', :busca, '%')) 
                   OR LOWER(m.crm) LIKE LOWER(CONCAT('%', :busca, '%')) 
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :busca, '%')))
              AND (:especialidade IS NULL OR m.especialidade = :especialidade)
              AND (:tipo IS NULL OR u.tipo = :tipo)
              AND u.ativo = true
            """)
    Page<Medico> filtrarProfissionais(
            @Param("busca") String busca, 
            @Param("especialidade") String especialidade, 
            @Param("tipo") TipoUsuario tipo, 
            Pageable pageable);
}