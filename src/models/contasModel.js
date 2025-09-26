const db = require("../database/config");

// Listar contas
function listarContas() {
  const sql = `
    SELECT 
      u.id_usuario,
      u.nome,
      u.email,
      u.perfil,
      u.statusUser,
      u.fk_hospital,
      u.fk_empresa,
      CASE 
        WHEN u.perfil IN ('empresa','adminEmpresa') 
             THEN e.nome 
        WHEN u.perfil IN ('hospital','adminHospital') 
             THEN h.nomeHospital
        ELSE 'Sem vínculo'
      END AS nomeInstituicao
    FROM Usuario u
    LEFT JOIN Hospital h ON u.fk_hospital = h.id_hospital
    LEFT JOIN EmpresaFabricante e ON u.fk_empresa = e.id_empresa;
  `;
  return db.executar(sql);
}

// Alterar status
function alterarAcesso(id, status) {
    const sql = `UPDATE Usuario SET statusUser = '${status}' WHERE id_usuario = ${id}`;
    return db.executar(sql);
}

// Deletar usuário
function deletar(id) {
    const sql = `DELETE FROM Usuario WHERE id_usuario = ${id}`;
    return db.executar(sql);
}

function cadastrarFunc(nome, email, senha, fk_empresa, fk_hospital, perfil) {
  fk_empresa = fk_empresa === undefined ? null : fk_empresa;
  fk_hospital = fk_hospital === undefined ? null : fk_hospital;
  const sql = `
    INSERT INTO Usuario (nome, email, senha_hash, perfil, fk_empresa, fk_hospital, statusUser) 
    VALUES ('${nome}', '${email}', '${senha}', '${perfil}', ${fk_empresa}, ${fk_hospital}, 'ativo');
  `;
  console.log("Executando a instrução SQL: \n" + sql);
  return db.executar(sql);
}

function listarHospitais() {
    const instrucao = "SELECT id_hospital, nomeHospital FROM Hospital;";
    return db.executar(instrucao);
}

function editarUsuario(id, nome, email, perfil, fkEmpresa, fkHospital) {
  const sql = `
    UPDATE Usuario
    SET nome = '${nome}',
        email = '${email}',
        perfil = '${perfil}',
        fk_empresa = ${fkEmpresa},
        fk_hospital = ${fkHospital === null ? "NULL" : fkHospital}
    WHERE id_usuario = ${id};
  `;
  return db.executar(sql);
}

module.exports = { listarContas, alterarAcesso, deletar, cadastrarFunc, listarHospitais, editarUsuario };
