drop database if exists zephyrus;

-- Criação do banco de dados
create database zephyrus;
    
use zephyrus;

create table Endereco (
id_endereco int primary key auto_increment,
logradouro varchar(150) not null,
numero varchar(10),
bairro varchar(100),
cidade varchar(100) not null,
estado char(2) not null,
cep varchar(15)
);

create table EmpresaFabricante (
id_empresa int primary key auto_increment,
nome varchar(100) not null,
cnpj varchar(20) unique not null,
email varchar(100),
fk_endereco int,
foreign key (fk_endereco) references Endereco(id_endereco)
);

create table Hospital (
id_hospital int primary key auto_increment,
nomeHospital varchar(100) not null,
cnpj varchar(20) unique not null,
fk_endereco int,
fk_empresa int not null,
foreign key (fk_endereco) references Endereco(id_endereco),
foreign key (fk_empresa) references EmpresaFabricante(id_empresa)
);

create table Usuario (
id_usuario int primary key auto_increment,
nome varchar(100) not null,
email varchar(100) unique not null,
senha_hash varchar(200) not null,
perfil enum('empresa', 'hospital', 'adminHospital', 'adminEmpresa') not null,
    statusUser varchar(8),
fk_empresa int,
fk_hospital int,
    constraint ck_status check(statusUser in ('ativo','inativo')),
foreign key (fk_empresa) references EmpresaFabricante(id_empresa),
foreign key (fk_hospital) references Hospital(id_hospital)
);

create table Modelo (
id_modelo int primary key auto_increment,
nome varchar(100) not null,
descricao varchar(200)
);

create table Ventilador (
id_ventilador int primary key auto_increment,
numero_serie varchar(50) unique not null,
fk_modelo int not null,
fk_hospital int not null,
fk_empresa int not null,
foreign key (fk_modelo) references Modelo(id_modelo),
foreign key (fk_hospital) references Hospital(id_hospital),
foreign key (fk_empresa) references EmpresaFabricante(id_empresa)
);
    

-- Inserts
-- Endereços
insert into Endereco (logradouro, numero, bairro, cidade, estado, cep) values
('Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100'), -- 1
('Rua das Flores', '200', 'Centro', 'Curitiba', 'PR', '80020-090'),     -- 2
('Rua Bahia', '45', 'Savassi', 'Belo Horizonte', 'MG', '30140-100');   -- 3

-- Empresa (apenas 1 fabricante)
insert into EmpresaFabricante (nome, cnpj, email, fk_endereco) values
('VentCare Ltda', '12.345.678/0001-90', 'contato@ventcare.com', 1);

-- Hospitais vinculados à empresa
insert into Hospital (nomeHospital, cnpj, fk_endereco, fk_empresa) values
('Hospital São Lucas', '11.222.333/0001-44', 2, 1),
('Hospital Santa Maria', '55.666.777/0001-88', 3, 1);

-- Usuários
insert into Usuario (nome, email, senha_hash, perfil,statusUser, fk_empresa, fk_hospital) values
('Ricardo Almeida', 'ricardo@ventcare.com', 'hash123', 'adminEmpresa','ativo', 1, null),
('Marina Costa', 'marina@ventcare.com', 'hash456', 'empresa','ativo', 1, null),
('Dr. Carlos', 'carlos@saolucas.org', 'hash789', 'adminHospital','ativo', null, 1),
('Ana Paula', 'ana@santamaria.org', 'hash000', 'hospital','ativo', null, 2);

-- Modelos
insert into Modelo (nome, descricao) values
('VX-1000', 'Ventilador pulmonar para UTI adulto'),
('VX-2000', 'Ventilador pulmonar neonatal'),
('AirPlus Pro', 'Modelo portátil para emergências');

-- Ventiladores (sempre ligados à mesma empresa)
insert into Ventilador (numero_serie, fk_modelo, fk_hospital, fk_empresa) values
('SN12345', 1, 1, 1),
('SN67890', 2, 1, 1),
('SN11111', 3, 2, 1);

desc Usuario;
select * from Usuario;
select * from Hospital;

create user 'zep_admin'@'%' identified by "Ventilador@123";

GRANT SELECT, INSERT, UPDATE, DELETE ON zephyrus.* TO 'zep_admin'@'%';

flush privileges;

