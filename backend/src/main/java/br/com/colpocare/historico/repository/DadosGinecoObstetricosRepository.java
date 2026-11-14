package br.com.colpocare.historico.repository;

import br.com.colpocare.historico.domain.DadosGinecoObstetricos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DadosGinecoObstetricosRepository extends JpaRepository<DadosGinecoObstetricos, Integer> {
    
    List<DadosGinecoObstetricos> findByPaciente_IdPacienteOrderByIdDadosDesc(Integer idPaciente);
}