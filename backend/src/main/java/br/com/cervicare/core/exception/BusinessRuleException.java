package br.com.cervicare.core.exception;

// Dado que passa nas validações dos campos, mas não faz sentido clínico
// (ex.: exame antes do nascimento da paciente).
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
