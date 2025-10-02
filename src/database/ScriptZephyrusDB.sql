DROP DATABASE IF EXISTS zephrus;

CREATE DATABASE zephrus;
USE zephrus;

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

INSERT INTO Endereco (logradouro, numero, bairro, cidade, estado, cep) 
VALUES 
('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01000-000'),
('Avenida Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100');

INSERT INTO EmpresaFabricante (nome, cnpj, email, fkEndereco) 
VALUES 
('Indústria Respiratória LTDA', '12345678000199', 'contato@respiratoria.com.br', 1),
('Ventiladores S/A', '98765432000188', 'atendimento@ventiladores.com', 2);

INSERT INTO Hospital (nomeHospital, cnpj, fkEndereco, fkEmpresa) 
VALUES 
('Hospital São Paulo', '12345678000101', 1, 1),
('Hospital das Clínicas', '98765432000110', 2, 2);

INSERT INTO Sala (andar, numero, descricao, fkHospital) 
VALUES 
(1, '101', 'Sala de emergência', 1),
(2, '205', 'Sala de UTI', 2);

INSERT INTO Ventilador (numero_serie, fkModelo, fkEmpresa, fkSala) 
VALUES 
('SN123456789', 1, 1, 1),
('SN987654321', 2, 2, 2);

INSERT INTO Usuario (nome, email, senha_hash, perfil, statusUser, fkEmpresa, fkHospital) 
VALUES 
('João da Silva', 'joao@empresa.com', 'senha_hash_1', 'empresa', 'ativo', 1, NULL),
('Maria Oliveira', 'maria@hospital.com', 'senha_hash_2', 'adminHospital', 'ativo', NULL, 1);


select * from Ventilador;
