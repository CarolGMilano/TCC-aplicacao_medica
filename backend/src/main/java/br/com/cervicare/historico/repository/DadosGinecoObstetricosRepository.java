package br.com.cervicare.historico.repository;

import br.com.cervicare.historico.domain.DadosGinecoObstetricos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DadosGinecoObstetricosRepository extends JpaRepository<DadosGinecoObstetricos, Integer> {
    
    List<DadosGinecoObstetricos> findByPaciente_IdPacienteOrderByIdDadosDesc(Integer idPaciente);
}