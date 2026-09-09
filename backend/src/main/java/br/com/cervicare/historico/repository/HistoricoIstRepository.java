package br.com.cervicare.historico.repository;

import br.com.cervicare.historico.domain.HistoricoIst;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoIstRepository extends JpaRepository<HistoricoIst, Integer> {
    
    List<HistoricoIst> findByPaciente_IdPacienteOrderByIdHistoricoDesc(Integer idPaciente);
}