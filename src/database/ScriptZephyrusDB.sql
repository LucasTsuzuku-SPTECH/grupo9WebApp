DROP DATABASE IF EXISTS zephyrus;

CREATE DATABASE zephyrus;
USE zephyrus;

CREATE TABLE IF NOT EXISTS Componente (
  idComponente INT NOT NULL AUTO_INCREMENT,
  nomeComponente VARCHAR(10) NULL,
  unidadeMedida VARCHAR(10) NULL,
  PRIMARY KEY (idComponente)
  );

CREATE TABLE IF NOT EXISTS Modelo (
  idModelo INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) ,
  descricao VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (idModelo)
  );

CREATE TABLE IF NOT EXISTS Endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT,
  logradouro VARCHAR(150),
  numero VARCHAR(10),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado CHAR(2),
  cep VARCHAR(15),
  PRIMARY KEY (idEndereco)
  );

CREATE TABLE IF NOT EXISTS EmpresaFabricante (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100),
  cnpj VARCHAR(20) ,
  email VARCHAR(100) ,
  fkEndereco INT ,
  PRIMARY KEY (idEmpresa),
  UNIQUE INDEX cnpj (cnpj),
    FOREIGN KEY (fkEndereco) REFERENCES Endereco (idEndereco)
    );

CREATE TABLE IF NOT EXISTS Hospital (
  idHospital INT NOT NULL AUTO_INCREMENT,
  nomeHospital VARCHAR(100),
  cnpj VARCHAR(20),
  fkEndereco INT,
  fkEmpresa INT,
  PRIMARY KEY (idHospital),
  UNIQUE INDEX cnpj (cnpj),
    FOREIGN KEY (fkEndereco) REFERENCES Endereco (idEndereco),
    FOREIGN KEY (fkEmpresa) REFERENCES EmpresaFabricante (idEmpresa)
    );

CREATE TABLE IF NOT EXISTS Sala (
  idSala INT NOT NULL AUTO_INCREMENT,
  andar INT,
  numero VARCHAR(20),
  descricao VARCHAR(45),
  fkHospital INT,
  PRIMARY KEY (idSala),
    FOREIGN KEY (fkHospital) REFERENCES Hospital (idHospital)
    );

CREATE TABLE IF NOT EXISTS Ventilador (
  idVentilador INT NOT NULL AUTO_INCREMENT,
  numero_serie VARCHAR(50),
  fkModelo INT,
  fkEmpresa INT,
  fkSala INT,
  PRIMARY KEY (idVentilador),
  UNIQUE INDEX numero_serie (numero_serie),
    FOREIGN KEY (fkModelo) REFERENCES Modelo (idModelo),
    FOREIGN KEY (fkEmpresa) REFERENCES EmpresaFabricante (idEmpresa),
    FOREIGN KEY (fkSala) REFERENCES Sala (idSala)
);

CREATE TABLE IF NOT EXISTS Parametro (
  idParametro INT NOT NULL AUTO_INCREMENT,
  fkComponente INT,
  fkVentilador INT,
  parametroMax DOUBLE,
  parametroMin DOUBLE,
  PRIMARY KEY (idParametro),
    FOREIGN KEY (fkComponente) REFERENCES Componente (idComponente),
    FOREIGN KEY (fkVentilador) REFERENCES Ventilador (idVentilador)
    );

CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100),
  email VARCHAR(100),
  senha_hash VARCHAR(200),
  perfil ENUM('empresa', 'hospital', 'adminHospital', 'adminEmpresa'),
  statusUser VARCHAR(8),
  fkEmpresa INT,
  fkHospital INT,
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email),
    FOREIGN KEY (fkEmpresa) REFERENCES EmpresaFabricante (idEmpresa),
    FOREIGN KEY (fkHospital) REFERENCES Hospital (idHospital)
    );

INSERT INTO Modelo (nome, descricao) 
VALUES 
('Ventilador X1', 'Ventilador modelo X1 utilizado para ventilação mecânica em hospitais'),
('Ventilador Y2', 'Ventilador modelo Y2, eficiente em suporte respiratório');

-- Inserção de Endereços
INSERT INTO Endereco (logradouro, numero, bairro, cidade, estado, cep) 
VALUES 
('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01000-000'),
('Avenida Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100'),
('Rua Sete de Setembro', '345', 'Centro', 'Rio de Janeiro', 'RJ', '20000-000'),
('Avenida Brasil', '560', 'Zona Norte', 'Rio de Janeiro', 'RJ', '21000-100'),
('Rua José Bonifácio', '800', 'Jardim Camburi', 'Vitória', 'ES', '29000-000');

-- Inserção de Empresas
INSERT INTO EmpresaFabricante (nome, cnpj, email, fkEndereco) 
VALUES 
('Indústria Respiratória LTDA', '12345678000199', 'contato@respiratoria.com.br', 1),
('Ventiladores S/A', '98765432000188', 'atendimento@ventiladores.com', 2),
('TechHealth Solutions', '55667788000111', 'contato@techhealth.com', 3),
('MedEquip Ltda', '99887766000122', 'suporte@medequip.com.br', 4),
('VentPlus Industries', '11223344556677', 'contato@ventplus.com', 5);

-- Inserção de Hospitais
INSERT INTO Hospital (nomeHospital, cnpj, fkEndereco, fkEmpresa) 
VALUES 
('Hospital São Paulo', '12345678000101', 1, 1),
('Hospital das Clínicas', '98765432000110', 2, 2),
('Hospital Santa Rita', '11223344000111', 3, 3),
('Hospital de Câncer', '22334455000122', 4, 4),
('Hospital Esperança', '33445566000133', 1, 5),
('Hospital São José', '44556677000144', 2, 1),
('Hospital Universitário', '55667788000155', 3, 1),
('Hospital Regional', '66778899000166', 4, 2),
('Hospital Santa Casa', '77889900100177', 5, 3),
('Hospital das Américas', '88990011223388', 1, 2),
('Hospital de Reabilitação', '99001122334499', 2, 4),
('Hospital e Maternidade', '10001122334400', 3, 5),
('Hospital Central', '11002233445500', 4, 1),
('Hospital São Vicente', '12003344556600', 5, 2),
('Hospital de Urgência', '13004455667700', 1, 3);

-- Inserção de Salas
INSERT INTO Sala (andar, numero, descricao, fkHospital) 
VALUES 
(1, '101', 'Emergência', 1),
(2, '205', 'UTI', 2),
(3, '301', 'Recuperação', 3),
(1, '102', 'Observação', 4),
(2, '201', 'Cirurgia', 5),
(1, '110', 'Atendimento', 6),
(2, '205', 'Emergência', 7),
(3, '303', 'UTI Neonatal', 8),
(1, '105', 'Consulta', 9),
(2, '210', 'Internação', 10),
(3, '305', 'Emergência', 11),
(1, '120', 'Atendimento', 12),
(2, '205', 'Recuperação', 13),
(3, '310', 'UTI', 14),
(1, '101', 'Emergência', 15);

-- Inserção de Usuários
INSERT INTO Usuario (nome, email, senha_hash, perfil, statusUser, fkEmpresa, fkHospital) 
VALUES 
('João da Silva', 'joao@empresa.com', 'hash1', 'empresa', 'ativo', 1, NULL),
('Maria Oliveira', 'maria@hospital.com', 'hash2', 'adminHospital', 'ativo', NULL, 1),
('Carlos Pereira', 'carlos@empresa.com', 'hash3', 'empresa', 'ativo', 2, NULL),
('Beatriz Lima', 'beatriz@hospital.com', 'hash4', 'adminHospital', 'ativo', NULL, 2),
('Felipe Costa', 'felipe@empresa.com', 'hash5', 'empresa', 'ativo', 3, NULL),
('Luciana Rocha', 'luciana@hospital.com', 'hash6', 'adminHospital', 'inativo', NULL, 3),
('Renato Souza', 'renato@empresa.com', 'hash7', 'empresa', 'ativo', 4, NULL),
('Sofia Almeida', 'sofia@hospital.com', 'hash8', 'adminHospital', 'ativo', NULL, 4),
('Gabriel Santos', 'gabriel@empresa.com', 'hash9', 'empresa', 'ativo', 5, NULL),
('Ana Oliveira', 'ana@hospital.com', 'hash10', 'adminHospital', 'inativo', NULL, 5),
('Ricardo Martins', 'ricardo@empresa.com', 'hash11', 'empresa', 'ativo', 1, NULL),
('Patrícia Costa', 'patricia@hospital.com', 'hash12', 'adminHospital', 'ativo', NULL, 6),
('Lucas Almeida', 'lucas@empresa.com', 'hash13', 'empresa', 'ativo', 2, NULL),
('Mariana Ferreira', 'mariana@hospital.com', 'hash14', 'adminHospital', 'ativo', NULL, 7),
('Daniel Oliveira', 'daniel@empresa.com', 'hash15', 'empresa', 'ativo', 3, NULL);

-- Inserção de Ventiladores
INSERT INTO Ventilador (numero_serie, fkModelo, fkEmpresa, fkSala) 
VALUES 
('SN123456789', 1, 1, 1),
('SN987654321', 2, 2, 2),
('SN112233445', 1, 3, 3),
('SN223344556', 2, 4, 4),
('SN334455667', 1, 5, 5),
('SN445566778', 2, 1, 6),
('SN556677889', 1, 2, 7),
('SN667788990', 2, 3, 8),
('SN778899001', 1, 4, 9),
('SN889900112', 2, 5, 10),
('SN990011223', 1, 2, 11),
('SN100022334', 2, 3, 12),
('SN110033445', 1, 4, 13),
('SN120044556', 2, 5, 14),
('SN130055667', 1, 1, 15);

-- Inserção de Componentes
INSERT INTO Componente (nomeComponente, unidadeMedida) 
VALUES 
('CPU', '%'),
('RAM', '%'),
('Disco', 'GB');

-- Parâmetros para Ventilador 1 (SN123456789)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 1, 100, 20),  -- CPU (máximo 100%, mínimo 20%)
(2, 1, 90, 50),    -- RAM (máximo 90%, mínimo 50%)
(3, 1, 100, 50);   -- Disco (máximo 100%, mínimo 50%)

-- Parâmetros para Ventilador 2 (SN987654321)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 2, 95, 25),   -- CPU (máximo 95%, mínimo 25%)
(2, 2, 80, 40),    -- RAM (máximo 80%, mínimo 40%)
(3, 2, 90, 60);    -- Disco (máximo 90%, mínimo 60%)

-- Parâmetros para Ventilador 3 (SN112233445)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 3, 100, 30),  -- CPU (máximo 100%, mínimo 30%)
(2, 3, 85, 45),   -- RAM (máximo 85%, mínimo 45%)
(3, 3, 95, 65);   -- Disco (máximo 95%, mínimo 65%)

-- Parâmetros para Ventilador 4 (SN223344556)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 4, 90, 20),   -- CPU (máximo 90%, mínimo 20%)
(2, 4, 70, 50),   -- RAM (máximo 70%, mínimo 50%)
(3, 4, 100, 50);  -- Disco (máximo 100%, mínimo 50%)

-- Parâmetros para Ventilador 5 (SN334455667)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 5, 98, 30),   -- CPU (máximo 98%, mínimo 30%)
(2, 5, 85, 40),   -- RAM (máximo 85%, mínimo 40%)
(3, 5, 85, 50);   -- Disco (máximo 85%, mínimo 50%)

-- Parâmetros para Ventilador 6 (SN445566778)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 6, 80, 20),   -- CPU (máximo 80%, mínimo 20%)
(2, 6, 60, 30),   -- RAM (máximo 60%, mínimo 30%)
(3, 6, 90, 60);   -- Disco (máximo 90%, mínimo 60%)

-- Parâmetros para Ventilador 7 (SN556677889)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 7, 100, 40),  -- CPU (máximo 100%, mínimo 40%)
(2, 7, 95, 60),   -- RAM (máximo 95%, mínimo 60%)
(3, 7, 100, 70);  -- Disco (máximo 100%, mínimo 70%)

-- Parâmetros para Ventilador 8 (SN667788990)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 8, 85, 25),   -- CPU (máximo 85%, mínimo 25%)
(2, 8, 70, 40),   -- RAM (máximo 70%, mínimo 40%)
(3, 8, 95, 60);   -- Disco (máximo 95%, mínimo 60%)

-- Parâmetros para Ventilador 9 (SN778899001)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 9, 95, 30),   -- CPU (máximo 95%, mínimo 30%)
(2, 9, 80, 50),   -- RAM (máximo 80%, mínimo 50%)
(3, 9, 100, 60);  -- Disco (máximo 100%, mínimo 60%)

-- Parâmetros para Ventilador 10 (SN889900112)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 10, 90, 20),  -- CPU (máximo 90%, mínimo 20%)
(2, 10, 75, 45),  -- RAM (máximo 75%, mínimo 45%)
(3, 10, 85, 55);  -- Disco (máximo 85%, mínimo 55%)

-- Parâmetros para Ventilador 11 (SN990011223)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 11, 80, 30),  -- CPU (máximo 80%, mínimo 30%)
(2, 11, 70, 40),  -- RAM (máximo 70%, mínimo 40%)
(3, 11, 100, 50); -- Disco (máximo 100%, mínimo 50%)

-- Parâmetros para Ventilador 12 (SN100022334)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 12, 100, 35),  -- CPU (máximo 100%, mínimo 35%)
(2, 12, 90, 50),   -- RAM (máximo 90%, mínimo 50%)
(3, 12, 95, 65);   -- Disco (máximo 95%, mínimo 65%)

-- Parâmetros para Ventilador 13 (SN110033445)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 13, 95, 40),   -- CPU (máximo 95%, mínimo 40%)
(2, 13, 75, 45),   -- RAM (máximo 75%, mínimo 45%)
(3, 13, 90, 60);   -- Disco (máximo 90%, mínimo 60%)

-- Parâmetros para Ventilador 14 (SN120044556)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 14, 90, 30),   -- CPU (máximo 90%, mínimo 30%)
(2, 14, 80, 50),   -- RAM (máximo 80%, mínimo 50%)
(3, 14, 85, 55);   -- Disco (máximo 85%, mínimo 55%)

-- Parâmetros para Ventilador 15 (SN130055667)
INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) 
VALUES 
(1, 15, 100, 40),  -- CPU (máximo 100%, mínimo 40%)
(2, 15, 95, 60),   -- RAM (máximo 95%, mínimo 60%)
(3, 15, 100, 70);  -- Disco (máximo 100%, mínimo 70%)

