package br.com.cervicare.paciente.dto;

import br.com.cervicare.historico.domain.enums.MetodoContraceptivo;
import br.com.cervicare.historico.domain.enums.StatusFumante;
import br.com.cervicare.historico.domain.enums.TipoIst;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

public record PacienteCompletoRequestDTO(
        @Valid @NotNull(message = "Dados do paciente são obrigatórios")
        PacienteRequestDTO paciente,

        @Valid DadosGinecoObstetricosNestedDTO dadosGinecoObstetricos,
        @Valid SaudeSexualNestedDTO saudeSexual,
        @Valid HistoricoTabagismoNestedDTO historicoTabagismo,
        @Valid List<HistoricoIstNestedDTO> historicoIst
) {
    public record DadosGinecoObstetricosNestedDTO(
            @NotNull @PositiveOrZero Integer numGestacao,
            @NotNull @PositiveOrZero Integer numPartoNormal,
            @NotNull @PositiveOrZero Integer numCesariana,
            @NotNull @PositiveOrZero Integer numAborto,
            @NotNull @PositiveOrZero Integer menarca,
            @PositiveOrZero Integer menopausa
    ) {}

    public record SaudeSexualNestedDTO(
            @NotNull @PositiveOrZero Integer sexarca,
            @NotNull MetodoContraceptivo mac,
            @NotNull @PositiveOrZero Integer numParceiros,
            @NotNull Boolean vvs
    ) {}

    public record HistoricoTabagismoNestedDTO(
            @PositiveOrZero Integer cigarrosDia,
            @PositiveOrZero Integer idadeInicio,
            @PositiveOrZero Integer idadeFim,
            @NotNull StatusFumante fumante
    ) {}

    public record HistoricoIstNestedDTO(
            @NotNull TipoIst ist,
            Boolean condilomaHpv
    ) {}
}