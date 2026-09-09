package br.com.cervicare.atendimento.repository;

import br.com.cervicare.atendimento.domain.Colposcopia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ColposcopiaRepository extends JpaRepository<Colposcopia, Integer> {

    @Query("SELECT c FROM Colposcopia c WHERE c.verETratar = true " +
           "AND c.dataRegistro <= :dataLimite " +
           "AND NOT EXISTS (SELECT 1 FROM Consulta cons WHERE cons.paciente = c.paciente AND cons.dataHora > CAST(c.dataRegistro AS timestamp))")
    List<Colposcopia> findVerETratarAtrasados(@Param("dataLimite") LocalDate dataLimite);

    List<Colposcopia> findByPaciente_IdPacienteOrderByDataRegistroDesc(Integer idPaciente);
}