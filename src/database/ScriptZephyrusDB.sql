CREATE DATABASE zephyrus;
USE zephyrus;



CREATE TABLE IF NOT EXISTS Componete (
  idComponete INT NOT NULL,
  nomeComponente VARCHAR(10) NULL,
  unidadeMedida VARCHAR(10) NULL,
  PRIMARY KEY (idComponete)
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
    FOREIGN KEY (fkComponente) REFERENCES Componete (idComponete),
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

