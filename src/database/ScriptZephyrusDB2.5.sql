CREATE DATABASE zephyrus;
USE zephyrus;





CREATE TABLE IF NOT EXISTS Componente (
  idComponente INT NOT NULL AUTO_INCREMENT,
  nomeComponente VARCHAR(10) NULL DEFAULT NULL,
  unidadeMedida VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (idComponente)
);

CREATE TABLE IF NOT EXISTS Endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT,
  logradouro VARCHAR(150) NULL DEFAULT NULL,
  numero VARCHAR(10) NULL DEFAULT NULL,
  bairro VARCHAR(100) NULL DEFAULT NULL,
  cidade VARCHAR(100) NULL DEFAULT NULL,
  estado CHAR(2) NULL DEFAULT NULL,
  cep VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (idEndereco)
);

CREATE TABLE IF NOT EXISTS EmpresaFabricante (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  cnpj VARCHAR(20) NULL DEFAULT NULL,
  email VARCHAR(100) NULL DEFAULT NULL,
  fkEndereco INT NULL DEFAULT NULL,
  PRIMARY KEY (idEmpresa),
  UNIQUE INDEX cnpj (cnpj),
  FOREIGN KEY (fkEndereco) REFERENCES Endereco (idEndereco)
);

CREATE TABLE IF NOT EXISTS Hospital (
  idHospital INT NOT NULL AUTO_INCREMENT,
  nomeHospital VARCHAR(100) NULL DEFAULT NULL,
  cnpj VARCHAR(20) NULL DEFAULT NULL,
  fkEndereco INT NULL DEFAULT NULL,
  PRIMARY KEY (idHospital),
  UNIQUE INDEX cnpj (cnpj),
  FOREIGN KEY (fkEndereco) REFERENCES Endereco (idEndereco)
);

CREATE TABLE IF NOT EXISTS Modelo (
  idModelo INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idModelo),
  FOREIGN KEY (fkEmpresa) REFERENCES EmpresaFabricante (idEmpresa)
);

CREATE TABLE IF NOT EXISTS Sala (
  idSala INT NOT NULL AUTO_INCREMENT,
  numero VARCHAR(20) NULL DEFAULT NULL,
  area VARCHAR(45) NULL DEFAULT NULL,
  fkHospital INT NULL DEFAULT NULL,
  PRIMARY KEY (idSala),
  FOREIGN KEY (fkHospital) REFERENCES Hospital (idHospital)
);

CREATE TABLE IF NOT EXISTS Ventilador (
  idVentilador INT NOT NULL AUTO_INCREMENT,
  numero_serie VARCHAR(50) NULL DEFAULT NULL,
  fkModelo INT NULL DEFAULT NULL,
  fkSala INT NULL DEFAULT NULL,
  PRIMARY KEY (idVentilador),
  UNIQUE INDEX numero_serie (numero_serie),
  FOREIGN KEY (fkModelo) REFERENCES Modelo (idModelo),
  FOREIGN KEY (fkSala) REFERENCES Sala (idSala)
);

CREATE TABLE IF NOT EXISTS Parametro (
  idParametro INT NOT NULL AUTO_INCREMENT,
  fkComponente INT NULL DEFAULT NULL,
  fkVentilador INT NULL DEFAULT NULL,
  parametroMax DOUBLE NULL DEFAULT NULL,
  parametroMin DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (idParametro),
  FOREIGN KEY (fkComponente) REFERENCES Componente (idComponente),
  FOREIGN KEY (fkVentilador) REFERENCES Ventilador (idVentilador)
);

CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  email VARCHAR(100) NULL DEFAULT NULL,
  senha_hash VARCHAR(200) NULL DEFAULT NULL,
  perfil ENUM('empresa', 'hospital', 'adminHospital', 'adminEmpresa') NULL DEFAULT NULL,
  statusUser VARCHAR(8) NULL DEFAULT NULL,
  fkEmpresa INT NULL DEFAULT NULL,
  fkHospital INT NULL DEFAULT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email),
  FOREIGN KEY (fkEmpresa) REFERENCES EmpresaFabricante (idEmpresa),
  FOREIGN KEY (fkHospital) REFERENCES Hospital (idHospital)
);

-- =====================
-- Inserts
-- =====================

-- Inserção de Endereços
INSERT INTO Endereco (logradouro, numero, bairro, cidade, estado, cep) 
VALUES 
('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01000-000'),
('Avenida Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100'),
('Rua Sete de Setembro', '345', 'Centro', 'Rio de Janeiro', 'RJ', '20000-000'),
('Avenida Brasil', '560', 'Zona Norte', 'Rio de Janeiro', 'RJ', '21000-100'),
('Rua José Bonifácio', '800', 'Jardim Camburi', 'Vitória', 'ES', '29000-000');

-- Inserção de Empresas Fabricantes
INSERT INTO EmpresaFabricante (nome, cnpj, email, fkEndereco) 
VALUES 
('Indústria Respiratória LTDA', '12345678000199', 'contato@respiratoria.com.br', 1),
('Ventiladores S/A', '98765432000188', 'atendimento@ventiladores.com', 2),
('TechHealth Solutions', '55667788000111', 'contato@techhealth.com', 3),
('MedEquip Ltda', '99887766000122', 'suporte@medequip.com.br', 4),
('VentPlus Industries', '11223344556677', 'contato@ventplus.com', 5);

-- Inserção de Hospitais
INSERT INTO Hospital (nomeHospital, cnpj, fkEndereco) 
VALUES 
('Hospital São Paulo', '12345678000101', 1),
('Hospital das Clínicas', '98765432000110', 2),
('Hospital Santa Rita', '11223344000111', 3),
('Hospital de Câncer', '22334455000122', 4),
('Hospital Esperança', '33445566000133', 5),
('Hospital São José', '44556677000144', 1),
('Hospital Universitário', '55667788000155', 2),
('Hospital Regional', '66778899000166', 3),
('Hospital Santa Casa', '77889900100177', 4),
('Hospital das Américas', '88990011223388', 5),
('Hospital de Reabilitação', '99001122334499', 1),
('Hospital e Maternidade', '10001122334400', 2),
('Hospital Central', '11002233445500', 3),
('Hospital São Vicente', '12003344556600', 4),
('Hospital de Urgência', '13004455667700', 5);

-- Inserção de Modelos
INSERT INTO Modelo (nome, fkEmpresa) 
VALUES 
('Ventilador X1', 1),
('Ventilador Y2', 2),
('Ventilador Z3', 3),
('Ventilador W4', 4),
('Ventilador Q5', 5);

-- Inserção de Salas
INSERT INTO Sala (numero, area, fkHospital) 
VALUES 
('101', 'Emergência', 1),
('205', 'UTI', 2),
('301', 'Recuperação', 3),
('102', 'Observação', 4),
('201', 'Cirurgia', 5),
('110', 'Atendimento', 6),
('205B', 'Emergência', 7),
('303', 'UTI Neonatal', 8),
('105', 'Consulta', 9),
('210', 'Internação', 10),
('305', 'Emergência', 11),
('120', 'Atendimento', 12),
('205C', 'Recuperação', 13),
('310', 'UTI', 14),
('101B', 'Emergência', 15);

-- Inserção de Ventiladores
INSERT INTO Ventilador (numero_serie, fkModelo, fkSala) 
VALUES 
('SN123456789', 1, 1),
('SN987654321', 2, 2),
('SN112233445', 3, 3),
('SN223344556', 4, 4),
('SN334455667', 5, 5),
('SN445566778', 1, 6),
('SN556677889', 2, 7),
('SN667788990', 3, 8),
('SN778899001', 4, 9),
('SN889900112', 5, 10),
('SN990011223', 1, 11),
('SN100022334', 2, 12),
('SN110033445', 3, 13),
('SN120044556', 4, 14),
('SN130055667', 5, 15);

-- Inserção de Componentes
INSERT INTO Componete (nomeComponente, unidadeMedida) 
VALUES 
('CPU', '%'),
('RAM', '%'),
('Disco', 'GB');

-- Parâmetros para Ventiladores
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
-- Ventilador 1
(1, 1, 100, 20),
(2, 1, 90, 50),
(3, 1, 100, 50),

-- Ventilador 2
(1, 2, 95, 25),
(2, 2, 80, 40),
(3, 2, 90, 60),

-- Ventilador 3
(1, 3, 100, 30),
(2, 3, 85, 45),
(3, 3, 95, 65),

-- Ventilador 4
(1, 4, 90, 20),
(2, 4, 70, 50),
(3, 4, 100, 50),

-- Ventilador 5
(1, 5, 98, 30),
(2, 5, 85, 40),
(3, 5, 85, 50),

-- Ventilador 6
(1, 6, 80, 20),
(2, 6, 60, 30),
(3, 6, 90, 60),

-- Ventilador 7
(1, 7, 100, 40),
(2, 7, 95, 60),
(3, 7, 100, 70),

-- Ventilador 8
(1, 8, 85, 25),
(2, 8, 70, 40),
(3, 8, 95, 60),

-- Ventilador 9
(1, 9, 95, 30),
(2, 9, 80, 50),
(3, 9, 100, 60),

-- Ventilador 10
(1, 10, 90, 20),
(2, 10, 75, 45),
(3, 10, 85, 55),

-- Ventilador 11
(1, 11, 80, 30),
(2, 11, 70, 40),
(3, 11, 100, 50),

-- Ventilador 12
(1, 12, 100, 35),
(2, 12, 90, 50),
(3, 12, 95, 65),

-- Ventilador 13
(1, 13, 95, 40),
(2, 13, 75, 45),
(3, 13, 90, 60),

-- Ventilador 14
(1, 14, 90, 30),
(2, 14, 80, 50),
(3, 14, 85, 55),

-- Ventilador 15
(1, 15, 100, 40),
(2, 15, 95, 60),
(3, 15, 100, 70);

-- Inserção de Usuários
INSERT INTO Usuario (nome, email, senha_hash, perfil, statusUser, fkEmpresa, fkHospital) 
VALUES 
('João da Silva', 'joao@empresa.com', 'hash1', 'adminEmpresa', 'ativo', 1, NULL),
('Maria Oliveira', 'maria@hospital.com', 'hash2', 'adminHospital', 'ativo', NULL, 1),
('Carlos Pereira', 'carlos@empresa.com', 'hash3', 'adminEmpresa', 'ativo', 2, NULL),
('Beatriz Lima', 'beatriz@hospital.com', 'hash4', 'adminHospital', 'ativo', NULL, 2),
('Felipe Costa', 'felipe@empresa.com', 'hash5', 'adminEmpresa', 'ativo', 3, NULL),
('Luciana Rocha', 'luciana@hospital.com', 'hash6', 'adminHospital', 'inativo', NULL, 3),
('Renato Souza', 'renato@empresa.com', 'hash7', 'adminEmpresa', 'ativo', 4, NULL),
('Sofia Almeida', 'sofia@hospital.com', 'hash8', 'adminHospital', 'ativo', NULL, 4),
('Gabriel Santos', 'gabriel@empresa.com', 'hash9', 'adminEmpresa', 'ativo', 5, NULL),
('Ana Oliveira', 'ana@hospital.com', 'hash10', 'adminHospital', 'inativo', NULL, 5);
