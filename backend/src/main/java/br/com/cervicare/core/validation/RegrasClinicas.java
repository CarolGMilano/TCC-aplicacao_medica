package br.com.cervicare.core.validation;

import br.com.cervicare.core.exception.BusinessRuleException;
import br.com.cervicare.historico.domain.enums.StatusFumante;

import java.time.LocalDate;
import java.time.Period;

// Regras que cruzam campos ou dependem da idade da paciente. São as mesmas do
// app mobile, repetidas aqui para valerem também para o web e a API.
public final class RegrasClinicas {

    private RegrasClinicas() {
    }

    public static void validarDataExame(LocalDate dataRegistro, LocalDate dataNascimento) {
        if (dataRegistro == null) return;
        if (dataRegistro.isAfter(LocalDate.now())) {
            throw new BusinessRuleException("A data do registro não pode ser no futuro.");
        }
        if (dataNascimento != null && dataRegistro.isBefore(dataNascimento)) {
            throw new BusinessRuleException("A data do registro não pode ser anterior ao nascimento da paciente.");
        }
    }

    public static void validarGineco(Integer menarca, Integer menopausa, LocalDate dataNascimento) {
        Integer idade = idade(dataNascimento);
        if (menarca != null && idade != null && menarca > idade) {
            throw new BusinessRuleException("A menarca não pode ser maior que a idade da paciente.");
        }
        if (menopausa == null) return;
        if (menarca != null && menopausa <= menarca) {
            throw new BusinessRuleException("A idade da menopausa deve ser maior que a da menarca.");
        }
        if (idade != null && menopausa > idade) {
            throw new BusinessRuleException("A menopausa não pode ser maior que a idade da paciente.");
        }
    }

    public static void validarSexarca(Integer sexarca, LocalDate dataNascimento) {
        Integer idade = idade(dataNascimento);
        if (sexarca != null && idade != null && sexarca > idade) {
            throw new BusinessRuleException("A sexarca não pode ser maior que a idade da paciente.");
        }
    }

    public static void validarTabagismo(
            StatusFumante fumante,
            Integer idadeInicio,
            Integer idadeFim,
            LocalDate dataNascimento
    ) {
        if (fumante == null || fumante == StatusFumante.NAO_FUMANTE) return;

        Integer idade = idade(dataNascimento);
        if (idadeInicio != null && idade != null && idadeInicio > idade) {
            throw new BusinessRuleException("A idade de início não pode ser maior que a da paciente.");
        }
        if (fumante == StatusFumante.EX_FUMANTE && idadeFim != null) {
            if (idadeInicio != null && idadeFim < idadeInicio) {
                throw new BusinessRuleException("A idade em que parou deve ser maior que a de início.");
            }
            if (idade != null && idadeFim > idade) {
                throw new BusinessRuleException("A idade em que parou não pode ser maior que a da paciente.");
            }
        }
    }

    // Campo condicional: obrigatório quando a condição está marcada.
    public static void exigir(boolean condicao, Object valor, String mensagem) {
        boolean vazio = valor == null
                || (valor instanceof String texto && texto.isBlank())
                || (valor instanceof java.util.Collection<?> lista && lista.isEmpty());
        if (condicao && vazio) {
            throw new BusinessRuleException(mensagem);
        }
    }

    private static Integer idade(LocalDate dataNascimento) {
        if (dataNascimento == null) return null;
        return Period.between(dataNascimento, LocalDate.now()).getYears();
    }
}
