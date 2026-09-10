package br.com.cervicare.core.config;

import br.com.cervicare.auth.domain.Usuario;
import br.com.cervicare.auth.domain.enums.TipoUsuario;
import br.com.cervicare.auth.repository.UsuarioRepository;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.medico.repository.MedicoRepository;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UsuarioRepository usuarioRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDadosIniciais() {
        if (usuarioRepository.count() == 0) {
            
            // 1. Criar Usuário Admin Padrão
            Usuario admin = new Usuario();
            admin.setEmail("admin@cervicare.com");
            admin.setSenha(passwordEncoder.encode("Senha@123"));
            admin.setSalt("BCrypt");
            admin.setAtivo(true);
            admin.setTipo(TipoUsuario.ADMINISTRADOR);
            admin = usuarioRepository.save(admin);

            // 2. Criar Perfil Médico para o Admin
            Medico medicoAdmin = new Medico();
            medicoAdmin.setUsuario(admin);
            medicoAdmin.setNome("Administrador CerviCare");
            medicoAdmin.setCrm("000000-PR");
            medicoAdmin.setEspecialidade("Ginecologia");
            medicoRepository.save(medicoAdmin);

            // 3. Criar Pacientes de Teste para o Dashboard
            if (pacienteRepository.count() == 0) {
                // Atualizado para incluir o parâmetro 'ativo' (true) exigido pelo novo construtor do lombok
                Paciente p1 = new Paciente(null, "Ana Souza", LocalDate.of(1985, 4, 12), "PRT-001", StatusPaciente.EM_INVESTIGACAO, true);
                Paciente p2 = new Paciente(null, "Beatriz Lima", LocalDate.of(1992, 8, 25), "PRT-002", StatusPaciente.AGUARDANDO_PROCEDIMENTO, true);
                Paciente p3 = new Paciente(null, "Clara Mendes", LocalDate.of(1975, 11, 5), "PRT-003", StatusPaciente.POS_PROCEDIMENTO, true);
                
                pacienteRepository.saveAll(List.of(p1, p2, p3));
            }
        }
    }
}