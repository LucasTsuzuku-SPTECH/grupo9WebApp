var controleModel = require("../models/controleModel");

function listarHospitais(req, res) {
    controleModel.listarHospitais()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum hospital encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao buscar hospitais: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function listarSalas(req, res) {
    controleModel.listarSalas()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhuma sala encontrada!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao buscar Salas: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarSala(req, res) {
    const idHospital = req.params.idHospital;
    controleModel.listarSala(idHospital)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhuma sala encontrada!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao buscar Salas: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarVentiladores(req, res) {
    const idHospital = req.params.idHospital;
    controleModel.listarVentiladores(idHospital)
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum ventilador encontrado!");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar ventiladores: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarVentiladoresSala(req, res) {
    const idSala = req.params.idSala;
    controleModel.listarVentiladoresSala(idSala)
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum ventilador encontrado!");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar ventiladores: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletarVentilador(req, res) {
    const idVentilador = req.params.idVentilador;

    controleModel.deletarVentilador(idVentilador)
        .then(() => {
            res.status(200).json({ message: "Ventilador deletado com sucesso!" });
        })
        .catch(erro => {
            console.error("Erro ao deletar ventilador: ", erro.sqlMessage);
            res.status(500).json({ message: "Erro ao deletar ventilador", erro: erro.sqlMessage });
        });
}

    async function criarVentilador(req, res) {
        const ventilador = req.body;

        try {
            const novoId = await controleModel.criarVentilador(ventilador);

            // se tiver componentes, cadastra
            if (ventilador.componentes && ventilador.componentes.length > 0) {
                for (const comp of ventilador.componentes) {
                    await controleModel.criarComponenteEParametro(comp, novoId);
                }
            }

            res.json({ message: "Ventilador e componentes criados com sucesso" });
        } catch (erro) {
            console.error("Erro ao criar ventilador: ", erro.sqlMessage || erro);
            res.status(500).json({ message: "Erro ao criar ventilador", erro: erro.sqlMessage });
        }
    }


function listarModelos(req, res) {
    controleModel.listarModelos()
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum modelo encontrado!");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar modelos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function buscarVentilador(req, res) {
    const idVentilador = req.params.idVentilador;
    const idSala = req.params.idSala;

    controleModel.buscarVentilador(idVentilador, idSala)
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado[0]); // retorna um único ventilador
            } else {
                res.status(404).send("Ventilador não encontrado");
            }
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarVentilador(req, res) {
    const idVentilador = req.params.idVentilador;
    const { numero_serie, fk_modelo, fk_sala} = req.body;

    controleModel.atualizarVentilador(idVentilador, numero_serie, fk_modelo, fk_sala)
        .then(() => res.json({ message: "Ventilador atualizado com sucesso" }))
        .catch(erro => {
            console.error("Erro ao atualizar ventilador: ", erro.sqlMessage);
            res.status(500).json({ message: "Erro ao atualizar ventilador", erro: erro.sqlMessage });
        });
}


function listarEnderecos(req, res) {
    controleModel.listarEnderecos()
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err.sqlMessage));
}

function criarEndereco(req, res) {
    const endereco = req.body;
    controleModel.criarEndereco(endereco)
        .then(result => res.json({ message: "Endereço criado", id: result.insertId }))
        .catch(err => res.status(500).json(err.sqlMessage));
}

function criarHospital(req, res) {
    console.log("entrei no controller")
    const hospital = req.body;
    controleModel.criarHospital(hospital)
        .then(result => res.json({ message: "Hospital criado", id: result.insertId }))
        .catch(err => res.status(500).json(err.sqlMessage));
}

async function buscarHospital(req, res) {
    const id = req.params.idHospital;
    controleModel.buscarHospital(id)
        .then(h => res.json(h[0]))
        .catch(err => res.status(500).json(err));
}

async function editarHospital(req, res) {
    const h = req.body;
    controleModel.editarHospital(h)
        .then(() => res.json({ message: 'Hospital atualizado' }))
        .catch(err => res.status(500).json(err));
}

async function deletarHospital(req, res) {
  try {
    const id = req.params.idHospital;
    await controleModel.deletarHospital(id);
    res.json({ message: "Hospital e ventiladores vinculados foram deletados" });
  } catch (err) {
    console.error("Erro ao deletar hospital:", err);
    res.status(500).json({ error: "Erro interno ao deletar hospital" });
  }
}

function listarParametros(req, res) {
    const idVentilador = req.params.idVentilador;
    controleModel.listarParametros(idVentilador)
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum parâmetro encontrado!");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar parâmetros:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

async function buscarComponentes(req, res) {
    const idVentilador = req.params.idVentilador;
    try {
        const comps = await controleModel.buscarComponentesPorVentilador(idVentilador);
        res.json(comps);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ message: "Erro ao buscar componentes", erro });
    }
}

async function atualizarComponente(req, res) {
    const { idComponente, nomeComponente, unidadeMedida, idParametro, parametroMin, parametroMax } = req.body;
    try {
        await controleModel.atualizarComponenteEParametro(idComponente, nomeComponente, unidadeMedida, idParametro, parametroMin, parametroMax);
        res.json({ message: "Componente atualizado com sucesso" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ message: "Erro ao atualizar componente", erro });
    }
}

async function criarComponenteEParametro(req, res) {
    const { nomeComponente, unidadeMedida, parametroMin, parametroMax, fkVentilador } = req.body;

    try {
        // 1 - Criar componente
        const novoComponente = await controleModel.criarComponente(nomeComponente, unidadeMedida);

        // 2 - Criar parâmetro vinculado ao ventilador + componente
        await controleModel.criarParametro(parametroMin, parametroMax, fkVentilador, novoComponente.insertId);

        res.status(201).json({ message: "Componente e parâmetro criados com sucesso!" });
    } catch (erro) {
        console.error("Erro ao criar componente e parâmetro: ", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro ao criar componente e parâmetro", erro: erro.sqlMessage || erro });
    }
}

async function deletarComponenteEParametro(req, res) {
    const { idComponente, idParametro } = req.params;

    try {
        // 1 - deletar parâmetro associado
        await controleModel.deletarParametro(idParametro);

        // 2 - deletar componente
        await controleModel.deletarComponente(idComponente);

        res.status(200).json({ message: "Componente e parâmetro removidos com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar componente e parâmetro: ", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro ao deletar componente e parâmetro", erro: erro.sqlMessage || erro });
    }
}

async function criarSala(req, res) {
    const sala = req.body;  // espera: { andar, numero, descricao, fkHospital }

    try {
        const novoId = await controleModel.criarSala(sala);
        res.json({ message: "Sala criada com sucesso", idSala: novoId });
    } catch (erro) {
        console.error("Erro ao criar sala: ", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro ao criar sala", erro: erro.sqlMessage });
    }
}

module.exports = {
    listarHospitais,
    listarVentiladores,
    deletarVentilador,
    criarVentilador,
    listarModelos,
    buscarVentilador,
    atualizarVentilador,
    listarEnderecos,
    criarEndereco,
    criarHospital,
    buscarHospital,
    editarHospital,
    deletarHospital,
    listarParametros,
    buscarComponentes,
    atualizarComponente,
    criarComponenteEParametro,
    deletarComponenteEParametro,
    listarSalas,
    criarSala,
    listarVentiladoresSala,
    listarSala
};


