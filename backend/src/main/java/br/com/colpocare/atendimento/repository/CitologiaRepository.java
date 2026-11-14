package br.com.colpocare.atendimento.repository;

import br.com.colpocare.atendimento.domain.Citologia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CitologiaRepository extends JpaRepository<Citologia, Integer> {
    
    List<Citologia> findByPaciente_IdPacienteOrderByDataRegistroDesc(Integer idPaciente);
}