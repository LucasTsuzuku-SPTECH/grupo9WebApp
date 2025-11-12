const db = require("../database/config");

// Listar contas
function listarContas() {
  const sql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.cargo,
      u.statusUser,
      u.fkHospital,
      u.fkEmpresa,
      CASE 
        WHEN u.cargo IN ('empresa','adminEmpresa') 
             THEN e.nome 
        WHEN u.cargo IN ('hospital','adminHospital') 
             THEN h.nomeHospital
        ELSE 'Sem vínculo'
      END AS nomeInstituicao
    FROM Usuario u
    LEFT JOIN Hospital h ON u.fkHospital = h.idHospital
    LEFT JOIN Empresa e ON u.fkEmpresa = e.idEmpresa;
  `;
  return db.executar(sql);
}

function listarContasHospital(idHospital) {
  const sql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.cargo,
      u.statusUser,
      u.fkHospital,
      h.nomeHospital
    FROM Usuario_hospital u
    LEFT JOIN Hospital h ON u.fkHospital = h.idHospital
    WHERE u.fkHospital = ${idHospital};
  `;
  return db.executar(sql);
}

function listarContasEmpresa(idEmpresa) {
  const sql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.cargo,
      u.statusUser,
      u.fkEmpresa,
      e.nomeEmpresa
    FROM Usuario_empresa u
    LEFT JOIN Empresa e ON u.fkEmpresa = e.idEmpresa
    WHERE u.fkEmpresa = ${idEmpresa};
  `;
  return db.executar(sql);
}

// Alterar status
function alterarAcessoEmpresa(id, status) {
  const sql = `UPDATE Usuario_empresa SET statusUser = '${status}' WHERE idUsuario = ${id}`;
  return db.executar(sql);
}

function alterarAcessoHospital(id, status) {
  const sql = `UPDATE Usuario_hospital SET statusUser = '${status}' WHERE idUsuario = ${id}`;
  return db.executar(sql);
}

// Deletar usuário
function deleteContaEmpresa(id) {
  const sql = `DELETE FROM Usuario_empresa WHERE idUsuario = ${id}`;
  return db.executar(sql);
}

function deleteContaHospital(id) {
  const sql = `DELETE FROM Usuario_hospital WHERE idUsuario = ${id}`;
  return db.executar(sql);
}

function cadastrarFuncHospital(nome, email, senha, cargo, fkHospital) {
  const sql = `
    INSERT INTO Usuario_hospital (nome, email, senha_hash, cargo, fkHospital, statusUser) 
    VALUES ('${nome}', '${email}', '${senha}', '${cargo}', ${fkHospital}, 'ativo');
  `;
  console.log("Executando a instrução SQL: \n" + sql);
  return db.executar(sql);
}
function cadastrarFuncEmpresa(nome, email, senha, fk_empresa, cargo) {
  const sql = `
    INSERT INTO Usuario_empresa (nome, email, senha_hash, cargo, fkEmpresa, statusUser) 
    VALUES ('${nome}', '${email}', '${senha}', '${cargo}', ${fk_empresa}, 'ativo');
  `;
  console.log("Executando a instrução SQL: \n" + sql);
  return db.executar(sql);
}

function listarHospitais() {
  const instrucao = "SELECT idHospital, nomeHospital FROM Hospital;";
  return db.executar(instrucao);
}

function editarContaHospital(id, nome, email, cargo) {
  const sql = `
    UPDATE Usuario_hospital
    SET nome = '${nome}',
        email = '${email}',
        cargo = '${cargo}'
    WHERE idUsuario = ${id};
  `;
  return db.executar(sql);
}
function editarContaEmpresa(id, nome, email, cargo) {
  const sql = `
    UPDATE Usuario_empresa
    SET nome = '${nome}',
        email = '${email}',
        cargo = '${cargo}'
    WHERE idUsuario = ${id};
  `;
  return db.executar(sql);
}

module.exports = { listarContas, alterarAcessoHospital, alterarAcessoEmpresa, deleteContaEmpresa, deleteContaHospital, cadastrarFuncEmpresa, cadastrarFuncHospital, listarHospitais, editarContaEmpresa, editarContaHospital, listarContasHospital, listarContasEmpresa };
