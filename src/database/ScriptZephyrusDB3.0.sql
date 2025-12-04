DROP DATABASE IF EXISTS zephyrus;
CREATE DATABASE IF NOT EXISTS zephyrus;
USE zephyrus ;


CREATE TABLE IF NOT EXISTS Componente (
idComponente INT NOT NULL AUTO_INCREMENT,
nomeComponente VARCHAR(10) NOT NULL,
unidadeMedida VARCHAR(10) NOT NULL,
PRIMARY KEY (idComponente))
;

CREATE TABLE IF NOT EXISTS Endereco (
idEndereco INT NOT NULL AUTO_INCREMENT,
logradouro VARCHAR(150) NULL,
numero VARCHAR(10) NULL DEFAULT NULL,
bairro VARCHAR(100) NULL DEFAULT NULL,
cidade VARCHAR(100) NULL DEFAULT NULL,
estado CHAR(2) NULL DEFAULT NULL,
cep VARCHAR(15) NOT NULL,
PRIMARY KEY (idEndereco))
;

CREATE TABLE IF NOT EXISTS Empresa (
idEmpresa INT NOT NULL AUTO_INCREMENT,
nomeEmpresa VARCHAR(100) NOT NULL,
cnpj VARCHAR(20) NOT NULL,
fkEndereco INT NOT NULL,
PRIMARY KEY (idEmpresa),
UNIQUE INDEX cnpj (cnpj ASC) VISIBLE,
FOREIGN KEY (fkEndereco) REFERENCES Endereco (idEndereco)
	);

CREATE TABLE IF NOT EXISTS Hospital (
idHospital INT NOT NULL AUTO_INCREMENT,
nomeHospital VARCHAR(100) NOT NULL,
cnpj VARCHAR(20) NOT NULL,
fkEndereco INT NOT NULL,
PRIMARY KEY (idHospital),
UNIQUE INDEX cnpj (cnpj ASC) VISIBLE,
FOREIGN KEY (fkEndereco) REFERENCES Endereco (idEndereco)
	);

CREATE TABLE IF NOT EXISTS Modelo (
idModelo INT NOT NULL AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
fkEmpresa INT NOT NULL,
PRIMARY KEY (idModelo),
FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
	);

CREATE TABLE IF NOT EXISTS Sala (
idSala INT NOT NULL AUTO_INCREMENT,
numero VARCHAR(20) NOT NULL,
area VARCHAR(45) NOT NULL,
fkHospital INT NOT NULL,
PRIMARY KEY (idSala),
FOREIGN KEY (fkHospital) REFERENCES Hospital (idHospital)
	);

CREATE TABLE IF NOT EXISTS Ventilador (
idVentilador INT NOT NULL AUTO_INCREMENT,
numero_serie VARCHAR(50) NOT NULL,
fkModelo INT NOT NULL,
fkSala INT NULL DEFAULT NULL,
PRIMARY KEY (idVentilador),
UNIQUE INDEX numero_serie (numero_serie ASC) VISIBLE,
FOREIGN KEY (fkModelo) REFERENCES Modelo (idModelo),
FOREIGN KEY (fkSala) REFERENCES Sala (idSala)
	);

CREATE TABLE IF NOT EXISTS Parametro (
idParametro INT NOT NULL AUTO_INCREMENT,
fkComponente INT NOT NULL,
fkVentilador INT NOT NULL,
parametroMax DOUBLE NOT NULL,
parametroMin DOUBLE NOT NULL,
PRIMARY KEY (idParametro),
FOREIGN KEY (fkComponente) REFERENCES Componente (idComponente),
FOREIGN KEY (fkVentilador) REFERENCES Ventilador (idVentilador)
	);

CREATE TABLE IF NOT EXISTS Usuario_hospital (
idUsuario INT NOT NULL AUTO_INCREMENT,
nome VARCHAR(100) NULL DEFAULT NULL,
email VARCHAR(100) NOT NULL,
senha_hash VARCHAR(200) NOT NULL,
cargo ENUM('adminHosp', 'funcHosp') NOT NULL,
statusUser VARCHAR(8) NULL DEFAULT NULL,
fkHospital INT NOT NULL,
PRIMARY KEY (idUsuario),
UNIQUE INDEX email (email ASC) VISIBLE,
FOREIGN KEY (fkHospital) REFERENCES Hospital (idHospital)
);

CREATE TABLE IF NOT EXISTS Usuario_empresa (
idUsuario INT NOT NULL AUTO_INCREMENT,
nome VARCHAR(100) NULL DEFAULT NULL,
email VARCHAR(100) NOT NULL,
senha_hash VARCHAR(200) NOT NULL,
cargo ENUM('adminEmpresa', 'funcEmpresa', 'suporteEmpresa') NOT NULL,
statusUser VARCHAR(8) NULL DEFAULT NULL,
fkEmpresa INT NOT NULL,
PRIMARY KEY (idUsuario),
UNIQUE INDEX email (email ASC) VISIBLE,
FOREIGN KEY (fkEmpresa)
REFERENCES Empresa (idEmpresa)
	);






INSERT INTO Endereco (logradouro, numero, bairro, cidade, estado, cep)
VALUES
('Rua das Flores', '123', 'Centro', 'Sao Paulo', 'SP', '01000-000'),          
('Avenida Paulista', '1000', 'Bela Vista', 'Sao Paulo', 'SP', '01310-100'),  
('Rua da Saude', '250', 'Centro', 'Campinas', 'SP', '13010-000'),            
('Avenida Joao Pessoa', '1220', 'Centro', 'Porto Alegre', 'RS', '90010-000');


INSERT INTO Empresa (nomeEmpresa, cnpj, fkEndereco)
VALUES
('Industria Respiratoria LTDA', '12345678000199', 1), 
('Ventiladores S/A', '98765432000188', 2);           


INSERT INTO Componente (nomeComponente, unidadeMedida)
VALUES
('CPU', '%'),        
('RAM', '%'),        
('Disco', 'GB'),     
('Bateria', '%'),    
('Processos', 'Inteiro'); 



INSERT INTO Modelo (nome, fkEmpresa)
VALUES
('Drager Evita Infinity V500', 1), 
('GE CARESCAPE R860', 1),          
('Hamilton-C6', 2),                
('Mindray SV300', 2);              


INSERT INTO Hospital (nomeHospital, cnpj, fkEndereco)
VALUES
('Hospital Sao Paulo', '12345678000101', 3),   
('Hospital das Clinicas SP', '98765432000110', 4);


INSERT INTO Sala (numero, area, fkHospital)
VALUES

('100','UTI',1), ('101','UTI',1), ('102','UTI',1),
('103','Neonatal',1), ('104','Neonatal',1), ('105','Neonatal',1),
('106','Pronto-Socorro',1), ('107','Pronto-Socorro',1), ('108','Pronto-Socorro',1),
('109','Internacao',1), ('110','Internacao',1), ('111','Internacao',1),
('112','Centro Cirurgico',1), ('113','Centro Cirurgico',1), ('114','Centro Cirurgico',1),

('100','UTI',2), ('101','UTI',2), ('102','UTI',2),
('103','Neonatal',2), ('104','Neonatal',2), ('105','Neonatal',2),
('106','Pronto-Socorro',2), ('107','Pronto-Socorro',2), ('108','Pronto-Socorro',2),
('109','Internacao',2), ('110','Internacao',2), ('111','Internacao',2),
('112','Centro Cirurgico',2), ('113','Centro Cirurgico',2), ('114','Centro Cirurgico',2);



INSERT INTO Ventilador (numero_serie, fkModelo, fkSala) VALUES
('VNT-DRG-0001', 1, 1), ('VNT-GEC-0002', 2, 1), ('VNT-DRG-0003', 1, 1),
('VNT-GEC-0004', 2, 2), ('VNT-DRG-0005', 1, 2), ('VNT-GEC-0006', 2, 2),
('VNT-DRG-0007', 1, 3), ('VNT-GEC-0008', 2, 3), ('VNT-DRG-0009', 1, 3),
('VNT-GEC-0010', 2, 4), ('VNT-DRG-0011', 1, 4), ('VNT-GEC-0012', 2, 4),
('VNT-DRG-0013', 1, 5), ('VNT-GEC-0014', 2, 5), ('VNT-DRG-0015', 1, 5),
('VNT-GEC-0016', 2, 6), ('VNT-DRG-0017', 1, 6), ('VNT-GEC-0018', 2, 6),
('VNT-DRG-0019', 1, 7), ('VNT-GEC-0020', 2, 7), ('VNT-DRG-0021', 1, 7),
('VNT-GEC-0022', 2, 8), ('VNT-DRG-0023', 1, 8), ('VNT-GEC-0024', 2, 8),
('VNT-DRG-0025', 1, 9), ('VNT-GEC-0026', 2, 9), ('VNT-DRG-0027', 1, 9),
('VNT-GEC-0028', 2, 10), ('VNT-DRG-0029', 1, 10), ('VNT-GEC-0030', 2, 10),
('VNT-DRG-0031', 1, 11), ('VNT-GEC-0032', 2, 11), ('VNT-DRG-0033', 1, 11),
('VNT-GEC-0034', 2, 12), ('VNT-DRG-0035', 1, 12), ('VNT-GEC-0036', 2, 12),
('VNT-DRG-0037', 1, 13), ('VNT-GEC-0038', 2, 13), ('VNT-DRG-0039', 1, 13),
('VNT-GEC-0040', 2, 14), ('VNT-DRG-0041', 1, 14), ('VNT-GEC-0042', 2, 14),
('VNT-DRG-0043', 1, 15), ('VNT-GEC-0044', 2, 15), ('VNT-DRG-0045', 1, 15),

('VNT-HML-0046', 3, 16), ('VNT-MDR-0047', 4, 16), ('VNT-HML-0048', 3, 16),
('VNT-MDR-0049', 4, 17), ('VNT-HML-0050', 3, 17), ('VNT-MDR-0051', 4, 17),
('VNT-HML-0052', 3, 18), ('VNT-MDR-0053', 4, 18), ('VNT-HML-0054', 3, 18),
('VNT-MDR-0055', 4, 19), ('VNT-HML-0056', 3, 19), ('VNT-MDR-0057', 4, 19),
('VNT-HML-0058', 3, 20), ('VNT-MDR-0059', 4, 20), ('VNT-HML-0060', 3, 20),
('VNT-MDR-0061', 4, 21), ('VNT-HML-0062', 3, 21), ('VNT-MDR-0063', 4, 21),
('VNT-HML-0064', 3, 22), ('VNT-MDR-0065', 4, 22), ('VNT-HML-0066', 3, 22),
('VNT-MDR-0067', 4, 23), ('VNT-HML-0068', 3, 23), ('VNT-MDR-0069', 4, 23),
('VNT-HML-0070', 3, 24), ('VNT-MDR-0071', 4, 24), ('VNT-HML-0072', 3, 24),
('VNT-MDR-0073', 4, 25), ('VNT-HML-0074', 3, 25), ('VNT-MDR-0075', 4, 25),
('VNT-HML-0076', 3, 26), ('VNT-MDR-0077', 4, 26), ('VNT-HML-0078', 3, 26),
('VNT-MDR-0079', 4, 27), ('VNT-HML-0080', 3, 27), ('VNT-MDR-0081', 4, 27),
('VNT-HML-0082', 3, 28), ('VNT-MDR-0083', 4, 28), ('VNT-HML-0084', 3, 28),
('VNT-MDR-0085', 4, 29), ('VNT-HML-0086', 3, 29), ('VNT-MDR-0087', 4, 29),
('VNT-HML-0088', 3, 30), ('VNT-MDR-0089', 4, 30), ('VNT-HML-0090', 3, 30);


INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin) VALUES
(1, 1, 88, 22), (2, 1, 76, 23), (3, 1, 440, 236), (4, 1, 81, 12), (5, 1, 310, 55),
(1, 2, 50, 22), (2, 2, 81, 38), (3, 2, 685, 126), (4, 2, 36, 22), (5, 2, 350, 70),
(1, 3, 100, 28), (2, 3, 82, 18), (3, 3, 664, 207), (4, 3, 46, 36), (5, 3, 280, 85),
(1, 4, 100, 89), (2, 4, 69, 59), (3, 4, 124, 73), (4, 4, 85, 30), (5, 4, 390, 60),
(1, 5, 51, 23), (2, 5, 74, 19), (3, 5, 677, 380), (4, 5, 97, 32), (5, 5, 260, 95),
(1, 6, 65, 37), (2, 6, 58, 27), (3, 6, 650, 330), (4, 6, 65, 29), (5, 6, 300, 50),
(1, 7, 81, 54), (2, 7, 89, 24), (3, 7, 866, 775), (4, 7, 62, 37), (5, 7, 340, 75),
(1, 8, 69, 20), (2, 8, 67, 42), (3, 8, 782, 322), (4, 8, 71, 15), (5, 8, 270, 65),
(1, 9, 63, 30), (2, 9, 93, 80), (3, 9, 841, 469), (4, 9, 29, 17), (5, 9, 360, 90),
(1, 10, 66, 24), (2, 10, 72, 31), (3, 10, 272, 165), (4, 10, 91, 52), (5, 10, 290, 50),
(1, 11, 51, 25), (2, 11, 76, 23), (3, 11, 132, 63), (4, 11, 70, 8), (5, 11, 330, 80),
(1, 12, 85, 58), (2, 12, 43, 14), (3, 12, 386, 111), (4, 12, 77, 43), (5, 12, 370, 60),
(1, 13, 50, 37), (2, 13, 64, 28), (3, 13, 491, 191), (4, 13, 69, 30), (5, 13, 255, 99),
(1, 14, 92, 44), (2, 14, 54, 21), (3, 14, 361, 307), (4, 14, 79, 51), (5, 14, 380, 52),
(1, 15, 67, 39), (2, 15, 54, 13), (3, 15, 973, 64), (4, 15, 94, 18), (5, 15, 305, 78),
(1, 16, 86, 59), (2, 16, 65, 16), (3, 16, 743, 273), (4, 16, 24, 14), (5, 16, 325, 68),
(1, 17, 86, 27), (2, 17, 54, 37), (3, 17, 525, 401), (4, 17, 85, 25), (5, 17, 345, 92),
(1, 18, 93, 46), (2, 18, 56, 17), (3, 18, 835, 420), (4, 18, 87, 26), (5, 18, 277, 73),
(1, 19, 61, 35), (2, 19, 88, 29), (3, 19, 410, 155), (4, 19, 63, 18), (5, 19, 355, 57),
(1, 20, 77, 41), (2, 20, 68, 33), (3, 20, 620, 290), (4, 20, 91, 38), (5, 20, 299, 88),
(1, 21, 55, 20), (2, 21, 75, 40), (3, 21, 500, 200), (4, 21, 70, 25), (5, 21, 335, 62),
(1, 22, 90, 55), (2, 22, 60, 22), (3, 22, 750, 350), (4, 22, 55, 15), (5, 22, 385, 95),
(1, 23, 68, 30), (2, 23, 85, 45), (3, 23, 450, 180), (4, 23, 80, 35), (5, 23, 265, 51),
(1, 24, 82, 48), (2, 24, 70, 30), (3, 24, 580, 250), (4, 24, 60, 20), (5, 24, 305, 80),
(1, 25, 59, 25), (2, 25, 80, 50), (3, 25, 690, 310), (4, 25, 95, 40), (5, 25, 345, 68),
(1, 26, 73, 36), (2, 26, 65, 28), (3, 26, 480, 190), (4, 26, 67, 22), (5, 26, 295, 90),
(1, 27, 88, 52), (2, 27, 78, 35), (3, 27, 720, 380), (4, 27, 72, 30), (5, 27, 365, 55),
(1, 28, 64, 29), (2, 28, 92, 48), (3, 28, 530, 210), (4, 28, 83, 33), (5, 28, 275, 75),
(1, 29, 79, 43), (2, 29, 63, 25), (3, 29, 660, 330), (4, 29, 58, 17), (5, 29, 318, 92),
(1, 30, 53, 21), (2, 30, 71, 39), (3, 30, 430, 170), (4, 30, 90, 37), (5, 30, 388, 51),
(1, 31, 70, 33), (2, 31, 62, 26), (3, 31, 780, 410), (4, 31, 75, 28), (5, 31, 320, 80),
(1, 32, 95, 50), (2, 32, 80, 42), (3, 32, 510, 230), (4, 32, 60, 20), (5, 32, 360, 65),
(1, 33, 58, 24), (2, 33, 91, 50), (3, 33, 600, 280), (4, 33, 85, 35), (5, 33, 270, 95),
(1, 34, 84, 40), (2, 34, 70, 32), (3, 34, 460, 190), (4, 34, 78, 30), (5, 34, 395, 52),
(1, 35, 66, 30), (2, 35, 87, 45), (3, 35, 740, 370), (4, 35, 92, 40), (5, 35, 315, 70),
(1, 36, 75, 38), (2, 36, 65, 25), (3, 36, 550, 260), (4, 36, 68, 22), (5, 36, 330, 88),
(1, 37, 91, 44), (2, 37, 72, 36), (3, 37, 800, 430), (4, 37, 57, 18), (5, 37, 375, 58),
(1, 38, 63, 28), (2, 38, 88, 48), (3, 38, 470, 200), (4, 38, 83, 33), (5, 38, 250, 78),
(1, 39, 78, 42), (2, 39, 67, 29), (3, 39, 630, 300), (4, 39, 70, 25), (5, 39, 340, 99),
(1, 40, 52, 23), (2, 40, 81, 40), (3, 40, 505, 220), (4, 40, 75, 30), (5, 40, 285, 65),
(1, 41, 65, 35), (2, 41, 90, 50), (3, 41, 650, 320), (4, 41, 80, 35), (5, 41, 300, 70),
(1, 42, 80, 45), (2, 42, 70, 30), (3, 42, 480, 200), (4, 42, 60, 20), (5, 42, 350, 85),
(1, 43, 58, 28), (2, 43, 85, 48), (3, 43, 700, 350), (4, 43, 90, 40), (5, 43, 270, 55),
(1, 44, 72, 32), (2, 44, 62, 24), (3, 44, 450, 180), (4, 44, 68, 25), (5, 44, 325, 92),
(1, 45, 87, 48), (2, 45, 78, 38), (3, 45, 600, 270), (4, 45, 75, 30), (5, 45, 365, 60),
(1, 46, 50, 20), (2, 46, 85, 45), (3, 46, 550, 250), (4, 46, 95, 35), (5, 46, 290, 75),
(1, 47, 68, 30), (2, 47, 70, 32), (3, 47, 480, 210), (4, 47, 78, 28), (5, 47, 330, 55),
(1, 48, 85, 42), (2, 48, 60, 25), (3, 48, 750, 380), (4, 48, 55, 15), (5, 48, 370, 80),
(1, 49, 61, 35), (2, 49, 88, 29), (3, 49, 410, 155), (4, 49, 63, 18), (5, 49, 355, 57),
(1, 50, 77, 41), (2, 50, 68, 33), (3, 50, 620, 290), (4, 50, 91, 38), (5, 50, 299, 88),
(1, 51, 55, 20), (2, 51, 75, 40), (3, 51, 500, 200), (4, 51, 70, 25), (5, 51, 335, 62),
(1, 52, 90, 55), (2, 52, 60, 22), (3, 52, 750, 350), (4, 52, 55, 15), (5, 52, 385, 95),
(1, 53, 68, 30), (2, 53, 85, 45), (3, 53, 450, 180), (4, 53, 80, 35), (5, 53, 265, 51),
(1, 54, 82, 48), (2, 54, 70, 30), (3, 54, 580, 250), (4, 54, 60, 20), (5, 54, 305, 80),
(1, 55, 59, 25), (2, 55, 80, 50), (3, 55, 690, 310), (4, 55, 95, 40), (5, 55, 345, 68),
(1, 56, 73, 36), (2, 56, 65, 28), (3, 56, 480, 190), (4, 56, 67, 22), (5, 56, 295, 90),
(1, 57, 88, 52), (2, 57, 78, 35), (3, 57, 720, 380), (4, 57, 72, 30), (5, 57, 365, 55),
(1, 58, 64, 29), (2, 58, 92, 48), (3, 58, 530, 210), (4, 58, 83, 33), (5, 58, 275, 75),
(1, 59, 79, 43), (2, 59, 63, 25), (3, 59, 660, 330), (4, 59, 58, 17), (5, 59, 318, 92),
(1, 60, 53, 21), (2, 60, 71, 39), (3, 60, 430, 170), (4, 60, 90, 37), (5, 60, 388, 51),
(1, 61, 70, 33), (2, 61, 62, 26), (3, 61, 780, 410), (4, 61, 75, 28), (5, 61, 320, 80),
(1, 62, 95, 50), (2, 62, 80, 42), (3, 62, 510, 230), (4, 62, 60, 20), (5, 62, 360, 65),
(1, 63, 58, 24), (2, 63, 91, 50), (3, 63, 600, 280), (4, 63, 85, 35), (5, 63, 270, 95),
(1, 64, 84, 40), (2, 64, 70, 32), (3, 64, 460, 190), (4, 64, 78, 30), (5, 64, 395, 52),
(1, 65, 66, 30), (2, 65, 87, 45), (3, 65, 740, 370), (4, 65, 92, 40), (5, 65, 315, 70),
(1, 66, 75, 38), (2, 66, 65, 25), (3, 66, 550, 260), (4, 66, 68, 22), (5, 66, 330, 88),
(1, 67, 91, 44), (2, 67, 72, 36), (3, 67, 800, 430), (4, 67, 57, 18), (5, 67, 375, 58),
(1, 68, 63, 28), (2, 68, 88, 48), (3, 68, 470, 200), (4, 68, 83, 33), (5, 68, 250, 78),
(1, 69, 78, 42), (2, 69, 67, 29), (3, 69, 630, 300), (4, 69, 70, 25), (5, 69, 340, 99),
(1, 70, 52, 23), (2, 70, 81, 40), (3, 70, 505, 220), (4, 70, 75, 30), (5, 70, 285, 65),
(1, 71, 65, 35), (2, 71, 90, 50), (3, 71, 650, 320), (4, 71, 80, 35), (5, 71, 300, 70),
(1, 72, 80, 45), (2, 72, 70, 30), (3, 72, 480, 200), (4, 72, 60, 20), (5, 72, 350, 85),
(1, 73, 58, 28), (2, 73, 85, 48), (3, 73, 700, 350), (4, 73, 90, 40), (5, 73, 270, 55),
(1, 74, 72, 32), (2, 74, 62, 24), (3, 74, 450, 180), (4, 74, 68, 25), (5, 74, 325, 92),
(1, 75, 87, 48), (2, 75, 78, 38), (3, 75, 600, 270), (4, 75, 75, 30), (5, 75, 365, 60),
(1, 76, 50, 20), (2, 76, 85, 45), (3, 76, 550, 250), (4, 76, 95, 35), (5, 76, 290, 75),
(1, 77, 68, 30), (2, 77, 70, 32), (3, 77, 480, 210), (4, 77, 78, 28), (5, 77, 330, 55),
(1, 78, 85, 42), (2, 78, 60, 25), (3, 78, 750, 380), (4, 78, 55, 15), (5, 78, 370, 80),
(1, 79, 61, 35), (2, 79, 88, 29), (3, 79, 410, 155), (4, 79, 63, 18), (5, 79, 355, 57),
(1, 80, 77, 41), (2, 80, 68, 33), (3, 80, 620, 290), (4, 80, 91, 38), (5, 80, 299, 88),
(1, 81, 55, 20), (2, 81, 75, 40), (3, 81, 500, 200), (4, 81, 70, 25), (5, 81, 335, 62),
(1, 82, 90, 55), (2, 82, 60, 22), (3, 82, 750, 350), (4, 82, 55, 15), (5, 82, 385, 95),
(1, 83, 68, 30), (2, 83, 85, 45), (3, 83, 450, 180), (4, 83, 80, 35), (5, 83, 265, 51),
(1, 84, 82, 48), (2, 84, 70, 30), (3, 84, 580, 250), (4, 84, 60, 20), (5, 84, 305, 80),
(1, 85, 59, 25), (2, 85, 80, 50), (3, 85, 690, 310), (4, 85, 95, 40), (5, 85, 345, 68),
(1, 86, 73, 36), (2, 86, 65, 28), (3, 86, 480, 190), (4, 86, 67, 22), (5, 86, 295, 90),
(1, 87, 88, 52), (2, 87, 78, 35), (3, 87, 720, 380), (4, 87, 72, 30), (5, 87, 365, 55),
(1, 88, 64, 29), (2, 88, 92, 48), (3, 88, 530, 210), (4, 88, 83, 33), (5, 88, 275, 75),
(1, 89, 79, 43), (2, 89, 63, 25), (3, 89, 660, 330), (4, 89, 58, 17), (5, 89, 318, 92),
(1, 90, 53, 21), (2, 90, 71, 39), (3, 90, 430, 170), (4, 90, 90, 37), (5, 90, 388, 51);


INSERT INTO Usuario_empresa (nome, email, senha_hash, cargo, statusUser, fkEmpresa)
VALUES
('Guilherme', 'guilherme@empresa.com', 'hash1', 'adminEmpresa', 'ativo', 1), 
('Lucas', 'lucas@empresa.com', 'hash2', 'funcEmpresa', 'ativo', 1),
('Isabela', 'isabela@empresa.com', 'hash3', 'suporteEmpresa', 'ativo', 1),
('Pedro Pereira', 'pedro@empresa.com', 'hash4', 'adminEmpresa', 'ativo', 2), 
('Ronaldo', 'ronaldo@empresa.com', 'hash5', 'funcEmpresa', 'ativo', 2),
('João Cocasso', 'João@empresa.com', 'hash6', 'suporteEmpresa', 'ativo', 2);



INSERT INTO Usuario_hospital (nome, email, senha_hash, cargo, statusUser, fkHospital)
VALUES
('Gustavo', 'gustavo@hospital.com', 'hash1', 'adminHosp', 'ativo', 1),
('Felipe', 'felipe@hospital.com', 'hash2', 'funcHosp', 'ativo', 1),
('Homero Sempsom', 'homero@hospital.com', 'hash3', 'adminHosp', 'ativo', 2), 
('Kelly Ken', 'kelly@hospital.com', 'hash4', 'funcHosp', 'ativo', 2);
 
    
