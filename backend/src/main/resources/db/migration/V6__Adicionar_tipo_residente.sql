-- Adiciona RESIDENTE aos tipos de usuário permitidos
ALTER TABLE usuario MODIFY COLUMN tipo ENUM('MEDICO', 'ADMINISTRADOR', 'RESIDENTE') NOT NULL;