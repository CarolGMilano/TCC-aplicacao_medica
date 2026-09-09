package br.com.cervicare.unit;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("CerviCare - Smoke Test Unitário")
class SmokeUnitTest {

    @Test
    @DisplayName("Deve executar um teste unitário")
    void deveExecutarTesteUnitario() {

        int resultado = 2 + 2;

        assertEquals(4, resultado);
    }
}