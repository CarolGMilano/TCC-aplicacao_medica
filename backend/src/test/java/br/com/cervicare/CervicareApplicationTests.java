package br.com.cervicare;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("CerviCare - Smoke Test")
class CervicareApplicationTests {

    @Test
    @DisplayName("Deve executar a suíte básica de testes")
    void deveExecutarSuiteBasica() {

        int resultado = 2 + 2;

        assertEquals(4, resultado);
    }
}