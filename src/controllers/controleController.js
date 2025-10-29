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

function HospitalUsuario(req, res) {
    const fkHospital = req.params.fkHospital
    controleModel.HospitalUsuario(fkHospital)

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
        if (ventilador.novoModelo.length > 0) {
            await controleModel.criarModelo(ventilador.novoModelo);
        }

        await controleModel.criarVentilador(ventilador);

        if (ventilador.componentes != 0 || ventilador.componentes != null) {
            for (const comp of ventilador.componentes) {
                await controleModel.criarParametro(comp);
            }
        }


        res.json({ message: "Ventilador criado com sucesso" });
    } catch (erro) {
        console.error("Erro ao criar ventilador: ", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro ao criar ventilador", erro: erro.sqlMessage, ventilador });
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
    // validação mínima - garante que o cliente enviou os campos esperados
    const idVentilador = Number(req.body.id_ventilador);
    const fk_sala = Number(req.body.fk_sala);

    if (!idVentilador || !fk_sala) {
        return res.status(400).json({ message: 'id_ventilador e fk_sala são obrigatórios e devem ser numéricos' });
    }

    controleModel.atualizarVentilador(idVentilador, fk_sala)
        .then(() => res.json({ message: "Ventilador atualizado com sucesso" }))
        .catch(erro => {
            console.error("Erro ao atualizar ventilador: ", erro.sqlMessage || erro);
            res.status(500).json({ message: "Erro ao atualizar ventilador", erro: erro.sqlMessage || erro });
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

async function atualizarParametro(req, res) {
    const idParametro = req.body.idParametro;
    const parametroMin = req.body.parametroMin;
    const parametroMax = req.body.parametroMax;
    try {
        await controleModel.atualizarParametro(idParametro, parametroMin, parametroMax);
        res.json({ message: "Componente atualizado com sucesso" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ message: "Erro ao atualizar componente", erro });
    }
}

async function criarParametro(req, res) {
    const parametroMin = req.body.parametroMin;
    const parametroMax = req.body.parametroMax;
    const numero_serie = req.body.numero_serie;
    const idComponente = req.body.idComponente;

    const objComp = {
        idComponente: Number(idComponente),
        numero_serie: numero_serie,
        parametroMax: Number(parametroMax),
        parametroMin: Number(parametroMin)
    };

    try {
        await controleModel.criarParametro(objComp);

        res.status(201).json({ message: "Parâmetro criado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao criar componente e parâmetro: ", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro ao criar parâmetro", erro: erro.sqlMessage || erro });
    }
}

async function deletarParametro(req, res) {
    const idParametro = Number(req.params.idParametro);

    try {
        await controleModel.deletarParametro(idParametro);

        res.status(200).json({ message: "Parâmetro removido com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar componente e parâmetro: ", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro ao deletar componente e parâmetro", erro: erro.sqlMessage || erro });
    }
}



module.exports = {
    listarHospitais,
    HospitalUsuario,
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
    criarParametro,
    atualizarParametro,
    deletarParametro,
    listarSalas,
    listarVentiladoresSala,
    listarSala
};


