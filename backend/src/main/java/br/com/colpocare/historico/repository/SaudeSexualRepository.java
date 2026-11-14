package br.com.colpocare.historico.repository;

import br.com.colpocare.historico.domain.SaudeSexual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaudeSexualRepository extends JpaRepository<SaudeSexual, Integer> {
    
    List<SaudeSexual> findByPaciente_IdPacienteOrderByIdDadosDesc(Integer idPaciente);
}