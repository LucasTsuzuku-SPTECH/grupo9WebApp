DROP DATABASE IF EXISTS zephyrus;
CREATE DATABASE IF NOT EXISTS zephyrus;
USE zephyrus ;

-- -----------------------------------------------------
-- Table componete
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS componente (
  idComponente INT NOT NULL AUTO_INCREMENT,
  nomeComponente VARCHAR(10) NOT NULL,
  unidadeMedida VARCHAR(10) NOT NULL,
  PRIMARY KEY (idComponente))
;


-- -----------------------------------------------------
-- Table endereco
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT,
  logradouro VARCHAR(150) NULL,
  numero VARCHAR(10) NULL DEFAULT NULL,
  bairro VARCHAR(100) NULL DEFAULT NULL,
  cidade VARCHAR(100) NULL DEFAULT NULL,
  estado CHAR(2) NULL DEFAULT NULL,
  cep VARCHAR(15) NOT NULL,
  PRIMARY KEY (idEndereco))
;


-- -----------------------------------------------------
-- Table empresa
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  nomeEmpresa VARCHAR(100) NOT NULL,
  cnpj VARCHAR(20) NOT NULL,
  fkEndereco INT NOT NULL,
  PRIMARY KEY (idEmpresa),
  UNIQUE INDEX cnpj (cnpj ASC) VISIBLE,
    FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
    );


-- -----------------------------------------------------
-- Table hospital
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hospital (
  idHospital INT NOT NULL AUTO_INCREMENT,
  nomeHospital VARCHAR(100) NOT NULL,
  cnpj VARCHAR(20) NOT NULL,
  fkEndereco INT NOT NULL,
  PRIMARY KEY (idHospital),
  UNIQUE INDEX cnpj (cnpj ASC) VISIBLE,
    FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
    );


-- -----------------------------------------------------
-- Table modelo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS modelo (
  idModelo INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idModelo),
    FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa)
    );


-- -----------------------------------------------------
-- Table sala
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS sala (
  idSala INT NOT NULL AUTO_INCREMENT,
  numero VARCHAR(20) NOT NULL,
  area VARCHAR(45) NOT NULL,
  fkHospital INT NOT NULL,
  PRIMARY KEY (idSala),
    FOREIGN KEY (fkHospital) REFERENCES hospital (idHospital)
    );


-- -----------------------------------------------------
-- Table ventilador
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ventilador (
  idVentilador INT NOT NULL AUTO_INCREMENT,
  numero_serie VARCHAR(50) NOT NULL,
  fkModelo INT NOT NULL,
  fkSala INT NULL DEFAULT NULL,
  PRIMARY KEY (idVentilador),
  UNIQUE INDEX numero_serie (numero_serie ASC) VISIBLE,
    FOREIGN KEY (fkModelo) REFERENCES modelo (idModelo),
    FOREIGN KEY (fkSala) REFERENCES sala (idSala)
    );


-- -----------------------------------------------------
-- Table parametro
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS parametro (
  idParametro INT NOT NULL AUTO_INCREMENT,
  fkComponente INT NOT NULL,
  fkVentilador INT NOT NULL,
  parametroMax DOUBLE NOT NULL,
  parametroMin DOUBLE NOT NULL,
  PRIMARY KEY (idParametro),
    FOREIGN KEY (fkComponente) REFERENCES componente (idComponente),
    FOREIGN KEY (fkVentilador) REFERENCES ventilador (idVentilador)
    );


-- -----------------------------------------------------
-- Table usuario_hospital
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_hospital (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  senha_hash VARCHAR(200) NOT NULL,
  cargo ENUM('adminHosp', 'funcHosp') NOT NULL,
  statusUser VARCHAR(8) NULL DEFAULT NULL,
  fkHospital INT NOT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email ASC) VISIBLE,
    FOREIGN KEY (fkHospital) REFERENCES hospital (idHospital)
);


-- -----------------------------------------------------
-- Table usuario_empresa
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_empresa (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  senha_hash VARCHAR(200) NOT NULL,
  cargo ENUM('adminEmpresa', 'funcEmpresa') NOT NULL,
  statusUser VARCHAR(8) NULL DEFAULT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email ASC) VISIBLE,
    FOREIGN KEY (fkEmpresa)
    REFERENCES empresa (idEmpresa)
    );
    
    
    -- ENDEREÇOS
	INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, cep) 
	VALUES 
	('Rua das Flores', '123', 'Centro', 'Sao Paulo', 'SP', '01000-000'),               
	
	('Rua da Saude', '250', 'Centro', 'Campinas', 'SP', '13010-000');

	-- Inserção de Empresas Fabricantes
	INSERT INTO empresa (nomeEmpresa, cnpj, fkEndereco) 
	VALUES 
	('Industria Respiratoria LTDA', '12345678000199', 1);


	-- COMPONENTES
	INSERT INTO componente (nomeComponente, unidadeMedida) 
	VALUES 
	('CPU', '%'),
	('RAM', '%'),
	('Disco', 'GB'),
	('Bateria', '%'),
	('Processos', 'Inteiro');

	-- MODELOS DE VENTILADORES
	INSERT INTO modelo (nome, fkEmpresa) 
	VALUES 
	('Drager Evita Infinity V500', 1);


	-- HOSPITAIS
	INSERT INTO hospital (nomeHospital, cnpj, fkEndereco) 
	VALUES
	('Hospital Sao Paulo', '12345678000101', 1);



	-- SALAS 
	INSERT INTO sala (numero, area, fkHospital) 
	VALUES
	-- Hospital 1
	('100','UTI',1);



	-- VENTILADORES 
	INSERT INTO ventilador (numero_serie, fkModelo, fkSala) VALUES
	('VNT-DRG-0001', 1, 1);



	-- Parâmetros para Ventiladores
	INSERT INTO parametro (fkComponente, fkVentilador, parametroMax, parametroMin) VALUES
	(1, 1, 88, 22);
	
	-- Inserção de Usuários
    INSERT INTO usuario_empresa (nome, email, senha_hash, cargo, statusUser, fkEmpresa)
    VALUES
    ('Pedro Pereira', 'pedro@empresa.com', 'hash1', 'adminEmpresa', 'ativo', 1),
    ('Ronaldo', 'ronaldo@empresa.com', 'hash2', 'funcEmpresa', 'ativo', 1);


    INSERT INTO usuario_hospital (nome, email, senha_hash, cargo, statusUser, fkHospital)
    VALUES
    ('Homero Sempsom', 'homero@hospital.com', 'hash3', 'adminHosp', 'ativo', 1),
    ('Kelly Ken', 'kelly@hospital.com', 'hash4', 'funcHosp', 'ativo', 1);