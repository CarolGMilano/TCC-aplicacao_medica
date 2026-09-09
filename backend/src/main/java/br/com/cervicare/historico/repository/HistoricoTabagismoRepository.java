package br.com.cervicare.historico.repository;

import br.com.cervicare.historico.domain.HistoricoTabagismo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoTabagismoRepository extends JpaRepository<HistoricoTabagismo, Integer> {
    
    List<HistoricoTabagismo> findByPaciente_IdPacienteOrderByIdHistoricoDesc(Integer idPaciente);
}