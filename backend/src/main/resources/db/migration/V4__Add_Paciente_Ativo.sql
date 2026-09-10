-- V4__Add_Paciente_Ativo.sql
-- Adiciona a coluna 'ativo' para permitir exclusão lógica (soft delete) garantindo integridade de prontuários

ALTER TABLE paciente 
ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;