-- V1__Initial_Setup.sql

-- 1. Controle de Acesso
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  salt VARCHAR(100) NOT NULL,
  ativo BOOLEAN NOT NULL,
  tipo ENUM('MEDICO', 'ADMINISTRADOR') NOT NULL
);

CREATE TABLE medico (
  id_medico INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  crm VARCHAR(45) NOT NULL UNIQUE,
  especialidade VARCHAR(50) NOT NULL,
  CONSTRAINT fk_medico_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

-- 2. Cadastro de Paciente
CREATE TABLE paciente (
  id_paciente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  data_nasc DATE NOT NULL,
  prontuario VARCHAR(50) NOT NULL,
  status ENUM('EM_INVESTIGACAO', 'EM_TRATAMENTO', 'AGUARDANDO_PROCEDIMENTO', 'POS_PROCEDIMENTO', 'ACOMPANHAMENTO_PREVENTIVO', 'ALTA') NOT NULL
);

-- 3. Anamnese e Histórico (Relacionamentos 1:1 e 1:N com Paciente)
CREATE TABLE dados_gineco_obstetricos (
  id_dados INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  num_gestacao INT NOT NULL,
  num_parto_normal INT NOT NULL,
  num_cesariana INT NOT NULL,
  num_aborto INT NOT NULL,
  menarca INT NOT NULL,
  menopausa INT,
  CONSTRAINT fk_dados_gineco_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
);

CREATE TABLE saude_sexual (
  id_dados INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  sexarca INT NOT NULL,
  mac ENUM('A definir') NOT NULL, -- Expanda os tipos conforme necessidade real
  num_parceiros INT NOT NULL,
  vvs BOOLEAN NOT NULL,
  CONSTRAINT fk_saude_sexual_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
);

CREATE TABLE historico_ist (
  id_historico INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  ist ENUM('HPV', 'HIV', 'HERPES_GENITAL', 'TRICOMONIASE', 'GONORREIA', 'CLAMIDIA', 'SIFILIS', 'NAO_SABE', 'NENHUMA') NOT NULL,
  condiloma_hpv BOOLEAN,
  CONSTRAINT fk_historico_ist_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
);

CREATE TABLE historico_tabagismo (
  id_historico INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  cigarros_dia INT,
  idade_inicio INT,
  idade_fim INT,
  fumante ENUM('FUMANTE', 'NAO_FUMANTE', 'EX_FUMANTE') NOT NULL,
  CONSTRAINT fk_historico_tabagismo_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
);

-- 4. Eventos Clínicos e Atendimentos
CREATE TABLE consulta (
  id_consulta INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  id_medico INT NOT NULL,
  data_hora DATETIME NOT NULL,
  observacao TEXT NOT NULL,
  CONSTRAINT fk_consulta_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
  CONSTRAINT fk_consulta_medico FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
);

CREATE TABLE citologia (
  id_exame INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  data_registro DATE NOT NULL,
  resultado ENUM('A definir') NOT NULL, -- Expanda para ASC-US, LSIL, etc.
  observacao TEXT,
  id_medico INT NOT NULL,
  data_edicao DATETIME NOT NULL,
  CONSTRAINT fk_citologia_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
  CONSTRAINT fk_citologia_medico FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
);

CREATE TABLE pcr_dna_hpv (
  id_exame INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  data_registro DATE NOT NULL,
  resultado ENUM('POSITIVO', 'NEGATIVO') NOT NULL,
  tipo_hpv ENUM('HPV_16', 'HPV_18', 'OUTROS'),
  observacao TEXT,
  id_medico INT NOT NULL,
  data_edicao DATETIME NOT NULL,
  CONSTRAINT fk_pcr_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
  CONSTRAINT fk_pcr_medico FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
);

CREATE TABLE colposcopia (
  id_colposcopia INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  data_registro DATE NOT NULL,
  estrogenizacao BOOLEAN NOT NULL,
  jec ENUM('0', '-1', '-2', '-3', '-4') NOT NULL,
  zt ENUM('ZT_1', 'ZT_2', 'ZT_3') NOT NULL,
  lesao BOOLEAN,
  recidiva BOOLEAN,
  grau_lesao ENUM('ALTO_GRAU', 'BAIXO_GRAU', 'INVASAO'),
  classificacao ENUM('P', 'M', 'G'),
  observacao TEXT,
  ver_e_tratar BOOLEAN NOT NULL,
  ver_e_tratar_motivo TEXT,
  id_medico INT NOT NULL,
  data_edicao DATETIME NOT NULL,
  CONSTRAINT fk_colposcopia_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
  CONSTRAINT fk_colposcopia_medico FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
);

CREATE TABLE procedimento (
  id_procedimento INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  data_registro DATE NOT NULL,
  tipo ENUM('BIOPSIA', 'EZT_1', 'EZT_2', 'EZT_3') NOT NULL,
  qt_fragmento INT NOT NULL,
  margem_endocervical ENUM('LIVRE', 'COMPROMETIDA', 'COINCIDENTE'),
  margem_ectocervical ENUM('LIVRE', 'COMPROMETIDA', 'COINCIDENTE'),
  resultado ENUM('NIC_1', 'NIC_2', 'NIC_3', 'ADENOCARCINOMA_IN_SITU', 'OUTROS') NOT NULL,
  observacao TEXT,
  id_medico INT NOT NULL,
  data_edicao DATETIME NOT NULL,
  CONSTRAINT fk_procedimento_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
  CONSTRAINT fk_procedimento_medico FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
);