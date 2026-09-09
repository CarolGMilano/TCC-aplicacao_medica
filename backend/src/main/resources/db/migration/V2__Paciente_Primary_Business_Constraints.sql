-- V2__Paciente_Primary_Business_Constraints.sql

ALTER TABLE paciente
    ADD CONSTRAINT uk_paciente_prontuario
    UNIQUE (prontuario);