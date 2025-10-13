CREATE DATABASE zephyrus;
USE zephyrus ;

-- -----------------------------------------------------
-- Table zephyrus.componete
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.componete (
  idComponete INT NOT NULL,
  nomeComponente VARCHAR(10) NULL DEFAULT NULL,
  unidadeMedida VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (idComponete))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.endereco
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT,
  logradouro VARCHAR(150) NULL DEFAULT NULL,
  numero VARCHAR(10) NULL DEFAULT NULL,
  bairro VARCHAR(100) NULL DEFAULT NULL,
  cidade VARCHAR(100) NULL DEFAULT NULL,
  estado CHAR(2) NULL DEFAULT NULL,
  cep VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (idEndereco))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.empresafabricante
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.empresafabricante (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  cnpj VARCHAR(20) NULL DEFAULT NULL,
  email VARCHAR(100) NULL DEFAULT NULL,
  fkEndereco INT NULL DEFAULT NULL,
  PRIMARY KEY (idEmpresa),
  UNIQUE INDEX cnpj (cnpj ASC) VISIBLE,
  INDEX fkEndereco (fkEndereco ASC) VISIBLE,
  CONSTRAINT empresafabricante_ibfk_1
    FOREIGN KEY (fkEndereco)
    REFERENCES zephyrus.endereco (idEndereco))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.hospital
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.hospital (
  idHospital INT NOT NULL AUTO_INCREMENT,
  nomeHospital VARCHAR(100) NULL DEFAULT NULL,
  cnpj VARCHAR(20) NULL DEFAULT NULL,
  fkEndereco INT NULL DEFAULT NULL,
  PRIMARY KEY (idHospital),
  UNIQUE INDEX cnpj (cnpj ASC) VISIBLE,
  INDEX fkEndereco (fkEndereco ASC) VISIBLE,
  CONSTRAINT hospital_ibfk_1
    FOREIGN KEY (fkEndereco)
    REFERENCES zephyrus.endereco (idEndereco))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.modelo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.modelo (
  idModelo INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idModelo),
  INDEX fk_modelo_empresafabricante1_idx (fkEmpresa ASC) VISIBLE,
  CONSTRAINT fk_modelo_empresafabricante1
    FOREIGN KEY (fkEmpresa)
    REFERENCES zephyrus.empresafabricante (idEmpresa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.sala
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.sala (
  idSala INT NOT NULL AUTO_INCREMENT,
  numero VARCHAR(20) NULL DEFAULT NULL,
  area VARCHAR(45) NULL DEFAULT NULL,
  fkHospital INT NULL DEFAULT NULL,
  PRIMARY KEY (idSala),
  INDEX fkHospital (fkHospital ASC) VISIBLE,
  CONSTRAINT sala_ibfk_1
    FOREIGN KEY (fkHospital)
    REFERENCES zephyrus.hospital (idHospital))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.ventilador
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.ventilador (
  idVentilador INT NOT NULL AUTO_INCREMENT,
  numero_serie VARCHAR(50) NULL DEFAULT NULL,
  fkModelo INT NULL DEFAULT NULL,
  fkSala INT NULL DEFAULT NULL,
  PRIMARY KEY (idVentilador),
  UNIQUE INDEX numero_serie (numero_serie ASC) VISIBLE,
  INDEX fkModelo (fkModelo ASC) VISIBLE,
  INDEX fkSala (fkSala ASC) VISIBLE,
  CONSTRAINT ventilador_ibfk_1
    FOREIGN KEY (fkModelo)
    REFERENCES zephyrus.modelo (idModelo),
  CONSTRAINT ventilador_ibfk_3
    FOREIGN KEY (fkSala)
    REFERENCES zephyrus.sala (idSala))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.parametro
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.parametro (
  idParametro INT NOT NULL AUTO_INCREMENT,
  fkComponente INT NULL DEFAULT NULL,
  fkVentilador INT NULL DEFAULT NULL,
  parametroMax DOUBLE NULL DEFAULT NULL,
  parametroMin DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (idParametro),
  INDEX fkComponente (fkComponente ASC) VISIBLE,
  INDEX fkVentilador (fkVentilador ASC) VISIBLE,
  CONSTRAINT parametro_ibfk_1
    FOREIGN KEY (fkComponente)
    REFERENCES zephyrus.componete (idComponete),
  CONSTRAINT parametro_ibfk_2
    FOREIGN KEY (fkVentilador)
    REFERENCES zephyrus.ventilador (idVentilador))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table zephyrus.usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS zephyrus.usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL DEFAULT NULL,
  email VARCHAR(100) NULL DEFAULT NULL,
  senha_hash VARCHAR(200) NULL DEFAULT NULL,
  perfil ENUM('empresa', 'hospital', 'adminHospital', 'adminEmpresa') NULL DEFAULT NULL,
  statusUser VARCHAR(8) NULL DEFAULT NULL,
  fkEmpresa INT NULL DEFAULT NULL,
  fkHospital INT NULL DEFAULT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email ASC) VISIBLE,
  INDEX fkEmpresa (fkEmpresa ASC) VISIBLE,
  INDEX fkHospital (fkHospital ASC) VISIBLE,
  CONSTRAINT usuario_ibfk_1
    FOREIGN KEY (fkEmpresa)
    REFERENCES zephyrus.empresafabricante (idEmpresa),
  CONSTRAINT usuario_ibfk_2
    FOREIGN KEY (fkHospital)
    REFERENCES zephyrus.hospital (idHospital))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
