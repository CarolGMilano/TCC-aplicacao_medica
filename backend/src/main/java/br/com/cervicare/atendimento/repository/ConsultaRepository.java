package br.com.cervicare.atendimento.repository;

import br.com.cervicare.atendimento.domain.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

    List<Consulta> findByPaciente_IdPacienteOrderByDataHoraDesc(Integer idPaciente);

    Optional<Consulta> findFirstByPaciente_IdPacienteOrderByDataHoraDesc(Integer idPaciente);
}