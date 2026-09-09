package br.com.cervicare.atendimento.repository;

import br.com.cervicare.atendimento.domain.PcrDnaHpv;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PcrDnaHpvRepository extends JpaRepository<PcrDnaHpv, Integer> {
    
    List<PcrDnaHpv> findByPaciente_IdPacienteOrderByDataRegistroDesc(Integer idPaciente);
}