export interface IDadosGinecoObstetricosRequest {
    idPaciente: number,
    numGestacao: number,
    numPartoNormal: number,
    numCesariana: number,
    numAborto: number,
    menarca: number,
    menopausa: number | null
}