package br.com.cervicare.atendimento.repository;

import br.com.cervicare.atendimento.domain.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProcedimentoRepository extends JpaRepository<Procedimento, Integer> {

    @Query("SELECT p FROM Procedimento p WHERE " +
           "p.dataRegistro <= :dataLimite " +
           "AND NOT EXISTS (SELECT 1 FROM Consulta cons WHERE cons.paciente = p.paciente AND cons.dataHora > CAST(p.dataRegistro AS timestamp))")
    List<Procedimento> findPosProcedimentoAtrasados(@Param("dataLimite") LocalDate dataLimite);

    List<Procedimento> findByPaciente_IdPacienteOrderByDataRegistroDesc(Integer idPaciente);
}