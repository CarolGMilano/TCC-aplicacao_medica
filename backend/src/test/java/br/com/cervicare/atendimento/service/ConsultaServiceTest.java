package br.com.cervicare.atendimento.service;

import br.com.cervicare.atendimento.domain.Consulta;
import br.com.cervicare.atendimento.dto.ConsultaRequestDTO;
import br.com.cervicare.atendimento.dto.ConsultaResponseDTO;
import br.com.cervicare.atendimento.repository.ConsultaRepository;
import br.com.cervicare.medico.domain.Medico;
import br.com.cervicare.medico.service.MedicoService;
import br.com.cervicare.paciente.domain.Paciente;
import br.com.cervicare.paciente.domain.enums.StatusPaciente;
import br.com.cervicare.paciente.repository.PacienteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConsultaServiceTest {

    @Mock
    private ConsultaRepository consultaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private MedicoService medicoService;

    @InjectMocks
    private ConsultaService consultaService;

    @Test
    @DisplayName("Deve registrar uma consulta injetando o médico logado com sucesso")
    void deveRegistrarConsultaComMedicoLogado() {
        
        // Arrange
        ConsultaRequestDTO request = new ConsultaRequestDTO(
                1, 
                LocalDateTime.now(), 
                "Paciente apresenta dores na região pélvica."
        );

        // Atualizado para incluir o parâmetro 'ativo' (true) exigido pelo novo construtor do lombok
        Paciente pacienteMock = new Paciente(
                1, "Ana Souza", LocalDate.of(1985, 4, 12), "PRT-001", StatusPaciente.EM_INVESTIGACAO, true
        );

        Medico medicoMock = new Medico(
                1, null, "Dra. Maria", "12345-PR", "Ginecologia"
        );

        Consulta consultaSalva = new Consulta(
                100, pacienteMock, medicoMock, request.dataHora(), request.observacao()
        );

        when(pacienteRepository.findById(request.idPaciente())).thenReturn(Optional.of(pacienteMock));
        when(medicoService.getMedicoLogado()).thenReturn(medicoMock);
        when(consultaRepository.save(any(Consulta.class))).thenReturn(consultaSalva);

        // Act
        ConsultaResponseDTO response = consultaService.registrar(request);

        // Assert
        assertNotNull(response);
        assertEquals(100, response.idConsulta());
        assertEquals("Ana Souza", response.nomePaciente());
        assertEquals("Dra. Maria", response.nomeMedico());
        assertEquals(request.observacao(), response.observacao());
        
        verify(pacienteRepository, times(1)).findById(request.idPaciente());
        verify(medicoService, times(1)).getMedicoLogado();
        verify(consultaRepository, times(1)).save(any(Consulta.class));
    }
}