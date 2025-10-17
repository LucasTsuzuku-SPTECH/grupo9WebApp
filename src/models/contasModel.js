const db = require("../database/config");

// Listar contas
function listarContas() {
  const sql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.perfil,
      u.statusUser,
      u.fkHospital,
      u.fkEmpresa,
      CASE 
        WHEN u.perfil IN ('empresa','adminEmpresa') 
             THEN e.nome 
        WHEN u.perfil IN ('hospital','adminHospital') 
             THEN h.nomeHospital
        ELSE 'Sem vínculo'
      END AS nomeInstituicao
    FROM Usuario u
    LEFT JOIN Hospital h ON u.fkHospital = h.idHospital
    LEFT JOIN EmpresaFabricante e ON u.fkEmpresa = e.idEmpresa;
  `;
  return db.executar(sql);
}

function listarContasHospital(idHospital) {
  const sql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.perfil,
      u.statusUser,
      u.fkHospital,
      u.fkEmpresa,
      CASE  
        WHEN u.perfil IN ('hospital','adminHospital') 
             THEN h.nomeHospital
        ELSE 'Sem vínculo'
      END AS nomeInstituicao
    FROM Usuario u
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
      u.perfil,
      u.statusUser,
      u.fkHospital,
      u.fkEmpresa,
      CASE  
        WHEN u.perfil IN ('empresa','adminEmpresa') 
             THEN e.nome
        ELSE 'Sem vínculo'
      END AS nomeInstituicao
    FROM Usuario u
    LEFT JOIN EmpresaFabricante e ON u.fkEmpresa = e.idEmpresa
    WHERE u.fkEmpresa = ${idEmpresa};
  `;
  return db.executar(sql);
}

// Alterar status
function alterarAcesso(id, status) {
    const sql = `UPDATE Usuario SET statusUser = '${status}' WHERE idUsuario = ${id}`;
    return db.executar(sql);
}

// Deletar usuário
function deletar(id) {
    const sql = `DELETE FROM Usuario WHERE idUsuario = ${id}`;
    return db.executar(sql);
}

function cadastrarFunc(nome, email, senha, fk_empresa, fk_hospital, perfil) {
  fk_empresa = fk_empresa === undefined ? null : fk_empresa;
  fk_hospital = fk_hospital === undefined ? null : fk_hospital;
  const sql = `
    INSERT INTO Usuario (nome, email, senha_hash, perfil, fkEmpresa, fkHospital, statusUser) 
    VALUES ('${nome}', '${email}', '${senha}', '${perfil}', ${fk_empresa}, ${fk_hospital}, 'ativo');
  `;
  console.log("Executando a instrução SQL: \n" + sql);
  return db.executar(sql);
}

function listarHospitais() {
    const instrucao = "SELECT idHospital, nomeHospital FROM Hospital;";
    return db.executar(instrucao);
}

function editarUsuario(id, nome, email, perfil) {
  const sql = `
    UPDATE Usuario
    SET nome = '${nome}',
        email = '${email}',
        perfil = '${perfil}'
    WHERE idUsuario = ${id};
  `;
  return db.executar(sql);
}

module.exports = { listarContas, alterarAcesso, deletar, cadastrarFunc, listarHospitais, editarUsuario, listarContasHospital,listarContasEmpresa};
